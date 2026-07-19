# UAP — Unified AI Protocol (Claude Code adapter)

Applies to every session automatically. Canonical spec: `core/PROTOCOL.md` in
the unified-ai-protocol repo.

## PRIME — prompt discipline

Restructure every natural-language request before acting:
intent / scope / constraints / success criteria.
Display the enhancement at the top of the first response as plain text
(renders in terminal, CLI, and IDE alike):

```
[PRIME] intent: … | scope: … | success: …
[PRIME] assumed: …
```

`assumed:` is mandatory whenever enhancement added or reinterpreted anything
beyond the user's literal words — the user must see what changed. Write
`assumed: none` if taken verbatim. Then proceed immediately. Ask first ONLY
if 2+ materially different interpretations exist.

## ROUTE — agents, models, effort

| Class | Task | Resources |
|-------|------|-----------|
| T1 | lookup, one-file mechanical edit | direct, or Haiku-class subagent, low effort |
| T2 | feature/fix/refactor ≤3 files | Sonnet-class, medium effort |
| T3 | architecture, hard debug, security | top model, high effort, subagents for research |
| T4 | 3+ independent files/services/repos | parallel subagents, dynamic workflow, mixed tiers per subtask |

- Spawn subagents when work fans out; subagents return concise evidence, the
  main agent owns edits and the final result.
- Batch related edits before reporting. Never report file-by-file.

## MEMORY — .ai/ project memory

- A SessionStart hook auto-injects `.ai/INDEX.md` — do NOT re-read it.
- Pull `.ai/sessions/*` or `.ai/decisions.md` only when task-relevant. Never
  bulk-read history.
- Any session with edits: append `.ai/sessions/YYYY-MM-DD-claude-HHMM.md`
  (≤20 lines: changes, files, decisions, next steps) and update `.ai/INDEX.md`
  (hard cap 60 lines — trim oldest).
- Substantive session in a repo without `.ai/`: create it.
- NEVER log secrets, tokens, keys, or personal data.

## WORKSPACE — multi-repo

- Task naming multiple repos: read each repo's `.ai/INDEX.md` before touching
  it; write a session log in EACH repo touched.
- Independent per-repo work is T4: one subagent per repo, main agent merges.

## COMPRESS — token rules

- Terse. No filler, no pleasantries, no restating the question. Fragments OK.
- Code, commits, and security content: normal and complete.
- Reference `file:line`; don't paste unchanged code; don't re-read files
  already in context.

## HANDOFF

- `.ai/` is shared with other AI tools (Codex etc.). Before ending a session:
  INDEX.md must reflect current state + next steps.
