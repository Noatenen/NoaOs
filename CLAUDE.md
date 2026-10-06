# CLAUDE.md — working rules for NoaOS

NoaOS is a personal, single-user, Hebrew/RTL-first web app for Noa. These rules apply to every Claude Code session in this repository. Product content lives in `docs/` — this file holds rules, not specification.

## Before you work

- Read the docs relevant to the task before any non-trivial change:

  | Touching… | Read first |
  |---|---|
  | Any feature / scope question | `docs/MVP.md`, `docs/PRODUCT.md` |
  | Screens, navigation, flows, Today | `docs/UX_ARCHITECTURE.md` |
  | Styling, visuals, components' look | `docs/DESIGN_DIRECTION.md` |
  | Code structure, dependencies, dates | `docs/TECH_ARCHITECTURE.md` |
  | Entities, storage, migrations | `docs/DATA_MODEL.md` |
  | Changing any earlier decision | `docs/DECISIONS.md` |

- `docs/` is the source of truth. If code and docs disagree, stop and ask which is right.

## Product rules

- **Single user.** No auth, accounts, roles, multi-user or tenant code. Don't generalize "for the future". Personalization is a feature.
- **Today is the center.** New features should consider how they surface in Today.
- **Hebrew-first, RTL-first.** `dir="rtl"` from the root. Use CSS logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) — never `left`/`right` for layout. Code, filenames and types stay English.
- **Rewards showing up, not being perfect.** No punitive streaks, failure states, guilt, or "missed" data. Soft goals and progress are fine.
- **Respect v0.1 scope** (`docs/MVP.md`). Ideas in `docs/ROADMAP.md` or `docs/PRODUCT.md` are not current requirements.
- **Do not invent product requirements silently.** If something is ambiguous, ask, or propose and mark it as a proposal.
- **Hebrew microcopy:** you may draft it, but mark it as a draft. Noa owns product voice (especially Rescue Me, Noa AI, prompts). Don't try to imitate how Noa talks.
- **Privacy:** never send personal data to an external service unless that integration was deliberately approved. No analytics, trackers or third-party scripts.

## Design rules

- Avoid generic SaaS / AI-dashboard aesthetics, grids of identical rounded cards, excessive pills, purple-blue AI gradients, beige wellness, childish gamification.
- 80% structured system, 20% Noa personality — applied selectively, never on every component.
- Figma is a UX/hierarchy reference, not a pixel contract.

## Code rules

- **Understandable over clever.** Noa knows HTML/CSS/JS/C# and is learning React/TS. Prefer plain, explicit code. Explain unfamiliar patterns (C#/JS analogies help).
- **No new dependency without a stated reason** and Noa's agreement. Prefer native browser APIs. Currently agreed: React, React Router, Vite, TypeScript, Vitest (dev).
- No Tailwind, no global state library, no date library, no CSS-in-JS.
- Layering: components → services → repositories → storage. **Components never touch `localStorage` or `data/` directly.**
- All "which day" logic goes through `src/lib/dates.ts` (04:00 day cutoff). Never compute day keys ad hoc.
- Verify before changing an architectural decision; record changes in `docs/DECISIONS.md`.

## Git rules — personal repository only

- The only allowed remote is `https://github.com/Noatenen/NoaOs.git` (account **Noatenen**).
- **Never** use the work identity or repos: `Noa-methodic`, `methodicelElearnig`, or any work org.
- **Never** modify global Git config or run `gh auth switch`. Identity and credentials are repo-local (`.git/config`): commits as `Noa <xnoatenx@gmail.com>`, pushes authenticate as `Noatenen` via a repo-local credential helper.
- Before every commit/push, check: `git status`, `git remote -v`, `git config --local user.email`. Before a push also confirm the credential helper still resolves to `Noatenen`.
- Commit or push only when Noa asks. Keep commits meaningful and scoped (one milestone/concern per commit).
- **No AI co-author trailers.** Commits use only the repo-local author identity. Do not add `Co-Authored-By: Claude…` or any other AI/Claude attribution to commit messages or PR descriptions unless Noa explicitly asks.
- The repo is **public**: never commit real personal data, backups, or exports.
