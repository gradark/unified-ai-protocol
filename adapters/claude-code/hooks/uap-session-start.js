#!/usr/bin/env node
// UAP SessionStart hook: inject .ai/INDEX.md into session context if present.
let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  const fs = require('fs');
  const path = require('path');
  let cwd = process.cwd();
  try {
    const data = JSON.parse(input);
    if (data.cwd) cwd = data.cwd;
  } catch {}
  const indexFile = path.join(cwd, '.ai', 'INDEX.md');
  try {
    const text = fs.readFileSync(indexFile, 'utf8').trim();
    console.log(
      '=== UAP PROJECT MEMORY (.ai/INDEX.md, auto-injected — do not re-read) ===\n' +
        text +
        '\n=== END UAP MEMORY (pull .ai/sessions/* or .ai/decisions.md only if task-relevant) ==='
    );
  } catch {
    console.log(
      'UAP: no .ai/ memory in this project. If this session makes substantive changes, create .ai/INDEX.md + a session log per protocol.'
    );
  }
  process.exit(0);
});
