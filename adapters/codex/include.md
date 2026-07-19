# UAP — Unified AI Protocol (Codex adapter)

Applies to every session automatically. Canonical spec: `core/PROTOCOL.md` in
the unified-ai-protocol repo.

## PRIME — prompt discipline

Restructure every natural-language request before acting:
intent / scope / constraints / success criteria.
Echo the spec in ≤3 lines at the top of the first response, then proceed
immediately. Ask first ONLY if 2+ materially different interpretations exist.

## ROUTE — agents, models, effort

| Class | Task | Resources |
|-------|------|-----------|
| T1 | lookup, one-file mechanical edit | low reasoning effort, no subagents |
| T2 | feature/fix/refactor ≤3 files | medium reasoning effort |
| T3 | architecture, hard debug, security | high reasoning effort, delegate research to subagents |
| T4 | 3+ independent files/services/repos | parallel subagents, mixed effort per subtask |

- Spawn subagents when work fans out; subagents return concise evidence, the
  main agent owns edits and the final result.
- Batch related edits before reporting. Never report file-by-file.

## MEMORY — .ai/ project memory

- Session start in any repo: if `.ai/INDEX.md` exists, read it FIRST — before
  other exploration. Read ONLY the index; pull `.ai/sessions/*` or
  `.ai/decisions.md` only when task-relevant. Never bulk-read history.
- Any session with edits: append `.ai/sessions/YYYY-MM-DD-codex-HHMM.md`
  (≤20 lines: changes, files, decisions, next steps) and update `.ai/INDEX.md`
  (hard cap 60 lines — trim oldest).
- Substantive session in a repo without `.ai/`: create it.
- NEVER log secrets, tokens, keys, or personal data.

## WORKSPACE — multi-repo

- When the user explicitly names multiple repos (or their parent folder), that
  is authorization for cross-repo work in this task: read each repo's
  `.ai/INDEX.md` before touching it; write a session log in EACH repo touched.
- Without explicit naming, the single-workspace boundary stands.

## COMPRESS — token rules

- Terse. No filler, no pleasantries, no restating the question. Fragments OK.
- Code, commits, and security content: normal and complete.
- Reference `file:line`; don't paste unchanged code; don't re-read files
  already in context.

## HANDOFF

- `.ai/` is shared with other AI tools (Claude Code etc.). Before ending a
  session: INDEX.md must reflect current state + next steps.
