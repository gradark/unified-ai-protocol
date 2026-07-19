#!/usr/bin/env node
// unified-ai-protocol installer.
// Usage: node scripts/install.js [--uninstall]
// Wires UAP into Claude Code (~/.claude) and Codex (~/.codex) global configs.
// Idempotent: re-running replaces the managed blocks, never duplicates them.
const fs = require('fs');
const path = require('path');
const os = require('os');

const UNINSTALL = process.argv.includes('--uninstall');
const HOME = os.homedir();
const REPO = path.resolve(__dirname, '..');
const START = '<!-- UAP START (managed by unified-ai-protocol installer) -->';
const END = '<!-- UAP END -->';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BLOCK_RE = new RegExp(esc(START) + '[\\s\\S]*?' + esc(END) + '\\n?', 'g');

function readIfExists(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function backup(file) {
  if (fs.existsSync(file) && !fs.existsSync(file + '.uap-bak')) {
    fs.copyFileSync(file, file + '.uap-bak');
  }
}

// Replace (or remove, on uninstall) the managed block in a markdown file.
function setBlock(file, content) {
  let text = readIfExists(file);
  if (text === null) {
    if (UNINSTALL) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    text = '';
  }
  backup(file);
  let out = text.replace(BLOCK_RE, '').replace(/\n{3,}/g, '\n\n').trimEnd();
  if (!UNINSTALL) {
    out += (out ? '\n\n' : '') + START + '\n' + content.trim() + '\n' + END;
  }
  fs.writeFileSync(file, out + '\n');
}

// --- Claude Code ---
const claudeDir = path.join(HOME, '.claude');
if (fs.existsSync(claudeDir)) {
  const include = fs.readFileSync(
    path.join(REPO, 'adapters', 'claude-code', 'include.md'),
    'utf8'
  );
  setBlock(path.join(claudeDir, 'CLAUDE.md'), include);

  const hooksDir = path.join(claudeDir, 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });
  const hookFiles = ['uap-session-start.js', 'uap-stop.js'];
  for (const h of hookFiles) {
    const dest = path.join(hooksDir, h);
    if (UNINSTALL) {
      try {
        fs.unlinkSync(dest);
      } catch {}
    } else {
      fs.copyFileSync(path.join(REPO, 'adapters', 'claude-code', 'hooks', h), dest);
    }
  }

  const settingsFile = path.join(claudeDir, 'settings.json');
  backup(settingsFile);
  const settings = JSON.parse(readIfExists(settingsFile) || '{}');
  settings.hooks = settings.hooks || {};
  const wire = (event, hookFile) => {
    let entries = settings.hooks[event] || [];
    entries = entries.filter((e) => !JSON.stringify(e).includes(hookFile));
    if (!UNINSTALL) {
      // process.execPath = the node running this installer; hooks reuse it so
      // they work even when node is not on the hook execution PATH.
      const cmd = `"${process.execPath}" "${path.join(hooksDir, hookFile)}"`;
      entries.push({ hooks: [{ type: 'command', command: cmd, timeout: 10 }] });
    }
    if (entries.length) settings.hooks[event] = entries;
    else delete settings.hooks[event];
  };
  wire('SessionStart', 'uap-session-start.js');
  wire('Stop', 'uap-stop.js');
  if (!Object.keys(settings.hooks).length) delete settings.hooks;
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\n');
  console.log(
    `Claude Code: ${UNINSTALL ? 'removed' : 'wired'} (CLAUDE.md block, hooks, settings.json)`
  );
} else {
  console.log('Claude Code: ~/.claude not found, skipped');
}

// --- Codex ---
const codexDir = path.join(HOME, '.codex');
if (fs.existsSync(codexDir)) {
  const include = fs.readFileSync(
    path.join(REPO, 'adapters', 'codex', 'include.md'),
    'utf8'
  );
  setBlock(path.join(codexDir, 'AGENTS.md'), include);
  console.log(`Codex: ${UNINSTALL ? 'removed' : 'wired'} (AGENTS.md block)`);
} else {
  console.log('Codex: ~/.codex not found, skipped');
}

console.log(
  UNINSTALL
    ? 'UAP uninstalled. Backups kept as *.uap-bak.'
    : 'UAP installed. New sessions pick it up automatically.'
);
