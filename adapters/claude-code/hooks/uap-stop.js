#!/usr/bin/env node
// UAP Stop hook: if this project uses .ai/ memory and no session log was
// written recently, ask Claude to log before stopping. Fires at most once per
// stop (stop_hook_active guards the loop). Silent in projects without .ai/.
let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  const fs = require('fs');
  const path = require('path');
  let data = {};
  try {
    data = JSON.parse(input);
  } catch {}
  if (data.stop_hook_active) process.exit(0);
  const cwd = data.cwd || process.cwd();
  if (!fs.existsSync(path.join(cwd, '.ai', 'INDEX.md'))) process.exit(0);
  const sessionsDir = path.join(cwd, '.ai', 'sessions');
  let newest = 0;
  try {
    for (const f of fs.readdirSync(sessionsDir)) {
      const t = fs.statSync(path.join(sessionsDir, f)).mtimeMs;
      if (t > newest) newest = t;
    }
  } catch {}
  const THIRTY_MIN = 30 * 60 * 1000;
  if (Date.now() - newest > THIRTY_MIN) {
    console.log(
      JSON.stringify({
        decision: 'block',
        reason:
          'UAP: no recent session log. If this session changed anything, append .ai/sessions/<YYYY-MM-DD>-claude-<HHMM>.md (≤20 lines: changes, files, decisions, next steps) and update .ai/INDEX.md, then stop. If nothing changed, just stop.',
      })
    );
  }
  process.exit(0);
});
