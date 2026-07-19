# UAP — Generic Adapter Template

Wire UAP into any AI coding tool in three steps.

## 1. Find the tool's global auto-loaded instruction file

Every serious AI coding tool loads a global instruction file into each
session. Examples:

| Tool | Global file |
|------|-------------|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex | `~/.codex/AGENTS.md` |
| Cursor | User Rules (Settings → Rules), or `.cursorrules` per project |
| Gemini CLI | `~/.gemini/GEMINI.md` |
| Windsurf | `global_rules.md` |

## 2. Paste the adapter block

Copy `adapters/codex/include.md` as your starting point (it's the
hook-free variant), wrap it in the managed markers, and append it to the
tool's global file:

```
<!-- UAP START (managed by unified-ai-protocol installer) -->
...adapter content...
<!-- UAP END -->
```

## 3. Adjust the tool-specific parts

- **ROUTE table** — map T1–T4 to the tool's actual model/effort controls
  (model picker, reasoning effort, subagent API). If the tool has no
  subagents, T4 becomes "sequential batches, still batch edits".
- **Session tag** — replace `codex` in the session filename with the tool's
  name (e.g. `2026-07-19-cursor-1430.md`) so `.ai/` history shows which AI
  did what.
- **MEMORY trigger** — if the tool supports startup hooks/scripts, auto-inject
  `.ai/INDEX.md` like the Claude Code adapter does; otherwise keep the
  "read INDEX.md first" instruction.

That's it — the tool now reads and writes the same `.ai/` memory as every
other UAP tool.
