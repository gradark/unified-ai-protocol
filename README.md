# Unified AI Protocol (UAP)

One spec that makes every AI coding tool you use work **focused, cheap, and
hand-off ready** — automatically, in every session, with no per-session setup.

Works today with **Claude Code** and **Codex**. Any other tool (Cursor, Gemini
CLI, Windsurf, …) can be wired in minutes with the
[generic adapter template](adapters/generic/TEMPLATE.md).

## What it does

- **PRIME** — every natural-language prompt is restructured into a technical
  spec (intent / scope / constraints / success criteria) before the AI acts.
  Kills vague-prompt hallucination. The enhancement is always displayed as a
  plain-text `[PRIME]` block at the top of the response — including a
  mandatory `assumed:` line listing everything the AI added or reinterpreted
  beyond your literal words — so misreads surface immediately in any surface
  (terminal, CLI, IDE), then it proceeds without blocking.
- **ROUTE** — tasks are classified T1–T4 and matched to the right model tier,
  reasoning effort, and agent strategy. Big tasks fan out to parallel
  subagents; related edits are batched before reporting.
- **MEMORY** — every project gets a `.ai/` directory: a hard-capped `INDEX.md`
  (~500 tokens, always read) plus per-session logs pulled only when relevant.
  Full context, no token burn.
- **WORKSPACE** — work across multiple repos from one terminal; each repo
  keeps its own memory and gets its own session log.
- **COMPRESS** — terse output rules (code and security content stay complete),
  `file:line` references instead of code dumps, no re-reading.
- **HANDOFF** — switch from Claude Code to Codex (or any tool) mid-project;
  the next AI resumes from `.ai/INDEX.md` with zero re-briefing. Session logs
  are tool-tagged so history shows which AI did what.

The full spec lives in [core/PROTOCOL.md](core/PROTOCOL.md).

## Install

Requires Node.js (you already have it if you run Claude Code).

```
git clone https://github.com/gradark/unified-ai-protocol
cd unified-ai-protocol
node scripts/install.js
```

(`install.ps1` / `install.sh` are thin wrappers for the same thing.)

What the installer touches:

| Tool | Change |
|------|--------|
| Claude Code | Appends a managed block to `~/.claude/CLAUDE.md`; copies 2 hooks to `~/.claude/hooks/`; registers them in `~/.claude/settings.json` (SessionStart injects `.ai/INDEX.md`, Stop reminds to write the session log) |
| Codex | Appends a managed block to `~/.codex/AGENTS.md` |

Everything sits between `<!-- UAP START -->` / `<!-- UAP END -->` markers.
Re-running the installer replaces the blocks — never duplicates. First-touch
backups are kept as `*.uap-bak`.

## Uninstall

```
node scripts/install.js --uninstall
```

Removes the managed blocks, hooks, and settings entries. Your `.ai/` project
memories are never touched.

## The .ai/ memory format

```
.ai/
├── INDEX.md      # rolling summary — hard cap 60 lines (~500 tokens)
├── sessions/     # 2026-07-19-claude-1830.md — ≤20 lines each
└── decisions.md  # durable architecture decisions
```

Commit `.ai/` to share context with your team, or add it to `.gitignore` to
keep it personal. Secrets are never logged, by protocol rule.

## Add another tool

See [adapters/generic/TEMPLATE.md](adapters/generic/TEMPLATE.md) — find the
tool's global instruction file, paste the block, adjust the model-tier
mapping. Done.

## License

[MIT](LICENSE)
