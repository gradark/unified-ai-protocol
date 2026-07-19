# Unified AI Protocol (UAP)

One spec that makes any coding AI work focused, cheap, and hand-off ready.
Wired into each tool's global config by the installer — auto-active in every
session, no per-session setup.

Modules: PRIME (prompt discipline) · ROUTE (agents/models/effort) ·
MEMORY (.ai/ project memory) · WORKSPACE (multi-repo) · COMPRESS (token rules) ·
HANDOFF (tool switching).

## 1. PRIME — prompt enhancement

Every natural-language request is restructured before acting:

- **intent** — the outcome the user wants
- **scope** — files/systems in play
- **constraints** — stack, style, limits
- **success** — how we know it's done

Echo the restructured spec in ≤3 lines at the top of the first response, then
proceed immediately. Ask first ONLY when two or more materially different
interpretations exist. Never execute a vague prompt literally; never pad a
clear prompt with questions.

## 2. ROUTE — agents, models, effort

Classify each task, then match resources. Tiers map per tool (Claude:
Haiku/Sonnet/Opus-class; others: smallest/default/max reasoning).

| Class | Examples | Model tier | Effort | Agents |
|-------|----------|-----------|--------|--------|
| T1 | lookup, rename, one-file mechanical edit | smallest | low | none |
| T2 | feature, bugfix, refactor ≤3 files | mid | medium | optional |
| T3 | architecture, hard debug, security | top | high | yes, for research |
| T4 | 3+ independent files/services/repos | mixed per subtask | per subtask | parallel subagents |

- Prefer dynamic workflows for large tasks; spawn subagents when work fans out.
- Subagents return concise evidence + file references; the main agent owns
  edits, conflict resolution, and the final result.
- Batch related edits before reporting back. Never report file-by-file.

## 3. MEMORY — .ai/ project memory

Layout per repo:

```
.ai/
├── INDEX.md      # rolling summary — HARD CAP 60 lines (~500 tokens)
├── sessions/     # YYYY-MM-DD-<tool>-<hhmm>.md, ≤20 lines each
└── decisions.md  # durable architecture decisions
```

Rules:

- Session start: read `.ai/INDEX.md` ONLY. Pull session/decision files only
  when the current task touches them. Never bulk-read history.
- Session end (any session that made edits): append a session file — what
  changed, files touched, decisions, next steps — and update INDEX.md summary.
  Trim INDEX.md to its cap, oldest lines first.
- First substantive session in a repo without `.ai/`: create it.
- NEVER log secrets, tokens, keys, or personal data.

INDEX.md sections: `State` (what the project is + where it stands),
`Decisions` (one-liners, details in decisions.md), `Active` (open tasks /
next steps), `Sessions` (one line each, newest first).

## 4. WORKSPACE — multi-repo from one terminal

- When a task names multiple repos (or a parent folder holding several), read
  each involved repo's `.ai/INDEX.md` before touching that repo.
- Write a session log in EACH repo touched — memory stays per-repo so any tool
  opening a single repo later still gets full context.
- Independent per-repo work is T4: prefer one subagent per repo, main agent
  merges results.
- Cross-repo work requires the user to have named the repos or their parent —
  never wander into unrelated siblings.

## 5. COMPRESS — token rules

- Terse output. No filler, no pleasantries, no restating the question.
  Sentence fragments OK.
- Code, commit messages, and security content: written normal and complete.
- Reference `file:line` instead of pasting unchanged code.
- Don't re-read files already in context; don't re-verify what tooling
  already verified.
- Prefer diffs over full-file dumps in explanations.

## 6. HANDOFF — switching tools

- Any AI opening a repo with `.ai/` resumes from INDEX.md — no human
  re-briefing needed.
- Session logs are tool-tagged (`-claude-`, `-codex-`, …) so history shows
  which AI did what.
- Before ending a session another tool may continue: ensure INDEX.md reflects
  current state and next steps.
