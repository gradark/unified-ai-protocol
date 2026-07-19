# UAP Design Doc

Date: 2026-07-19. Status: approved, v1 implemented.

## Problem

AI coding tools (Claude Code, Codex, …) each behave differently: vague prompts
cause hallucination, big tasks run single-threaded, context is lost when
switching tools, and long histories burn tokens. Existing fixes are per-tool
plugins that don't transfer.

## Decisions (from brainstorm)

1. **Targets v1**: Claude Code + Codex adapters, generic template for others.
2. **Prompt enhancement**: echo restructured spec (≤3 lines) + proceed;
   confirm only when 2+ valid interpretations. Rejected: silent (hides
   misreads), always-confirm (doubles round-trips).
3. **Memory**: per-project `.ai/` with index-first reads. Rejected: full
   history read every start (10–100K tokens, contradicts token goal); global
   `~/.ai-memory` (doesn't travel with repo).
4. **Existing systems**: absorb caveman-mode compression + remember-plugin
   logging into the protocol so all tools get them; disable those plugins
   after install (user-specific migration, not part of this repo).
5. **Architecture**: one canonical `core/PROTOCOL.md` + thin per-tool include
   blocks + node installer. Rejected: instruction-only (no enforcement),
   MCP memory server (heavy, still needs instruction shims; possible v2).
6. **Multi-repo** (added mid-build): WORKSPACE module — per-repo memory,
   session log in each repo touched, subagent per repo for independent work.

## Components

- `core/PROTOCOL.md` — canonical spec, 6 modules (PRIME, ROUTE, MEMORY,
  WORKSPACE, COMPRESS, HANDOFF).
- `adapters/claude-code/` — include block + 2 hooks:
  - SessionStart: injects `.ai/INDEX.md` into context (enforced recall).
  - Stop: blocks once with a logging reminder when `.ai/` exists but no
    session file was written in the last 30 min (enforced persistence);
    `stop_hook_active` prevents loops; silent in projects without `.ai/`.
- `adapters/codex/` — include block only (Codex has no hooks; AGENTS.md is
  auto-read every session, which is the auto-activation mechanism).
- `scripts/install.js` — idempotent marker-based wiring (`<!-- UAP START/END -->`),
  first-touch `*.uap-bak` backups, `--uninstall` reverses everything.
  `install.ps1`/`install.sh` are thin wrappers.

## Known trade-offs

- Adapter include blocks duplicate the protocol content (~60 lines per tool);
  drift between them and PROTOCOL.md is possible. Accepted for v1 —
  single-file includes keep installs dead simple.
- Codex side has no enforcement, instruction-only. Accepted: Codex reads
  AGENTS.md reliably.
- Stop hook costs one extra round-trip in `.ai/` projects when a session made
  no changes. Accepted: cheap vs. lost context.
