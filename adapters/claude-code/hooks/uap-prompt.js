#!/usr/bin/env node
// UAP UserPromptSubmit hook: per-prompt PRIME enforcement reminder.
// Instruction-only rules degrade over long sessions; this injects one line
// of context on every prompt so the [PRIME] display always fires.
let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  console.log(
    'UAP PRIME active: display the [PRIME] intent/scope/success + assumed block at the top of your response (assumed: none if verbatim), then proceed per protocol.'
  );
  process.exit(0);
});
