# Decisions

> Purpose of this doc: a short log of decisions, so they aren't silently re-litigated or reversed. To change a decision, add a new entry that supersedes the old one (don't edit history). Format: decision · why · alternatives considered.

## 2026-10-06 — Planning phase

**D1. Single user, no auth/accounts/roles/tenancy.**
Why: NoaOS is for Noa only; generality is not a requirement. · Alt: "future-proof" multi-user — rejected.

**D2. Vite + React + TypeScript + React Router (not Next.js).**
Why: no server in v0.1; Next.js server/client split and hydration issues around localStorage and dates add friction without benefit. Vite yields a plain static SPA. · Alt: Next.js static export.

**D3. CSS Modules + plain CSS + custom-property tokens. No Tailwind.**
Why: full control over a custom visual language; readable for Noa. · Alt: Tailwind.

**D4. No global state library, no date library in v0.1.**
Why: built-in `useSyncExternalStore` and `Intl` suffice. Revisit only on demonstrated pain.

**D5. Layering: components → services → repositories → storage; only `storage.ts` touches localStorage.**
Why: keep UI decoupled from browser storage so a later backend/IndexedDB swap is local.

**D6. `AIProvider` is the only external-service boundary in v0.1, implemented by `MockAIProvider`.**
Why: real AI is a known future; other providers wait until their integrations exist.

**D7. NoaOS day ends at 04:00 local time.**
Why: late-night reflections and captures belong to the day being lived.

**D8. Focus items are free text with an optional task link; max 3.**
Why: fast in the morning, while allowing one source of truth for tasks when wanted. Completing a linked item completes the task.

**D9. Unfinished focus items are not auto-carried; next check-in offers them for opt-in.**
Why: no debt from missed days, while still not losing things.

**D10. Water & steps use soft goals with progress indicators.**
Why: progress is useful. Anti-punishment means no failure messaging, streaks or guilt — not no goals. *(Water unit refined by D22.)*

**D11. All 7 primary areas visible from v0.1; unbuilt areas show honest placeholders.**
Why: the app should feel like the whole OS architecture from the start.

**D12. Capture is text + links only in v0.1.**
Why: images need IndexedDB; localStorage is too small.

**D13. JSON export/import is a v0.1 requirement.**
Why: browser storage is the only source of truth.

**D14. Primary device is Chrome on Mac; responsive from the start; no cross-device sync in v0.1.**
Why: realistic scope; the UI must not imply devices share data.

**D15. v0.1 Definition of Done = the full daily loop works end-to-end (incl. reload and next-day rollover). 7 days of real use is post-v0.1 validation.**

**D16. Claude drafts Hebrew microcopy; Noa owns product voice.**

**D17. Mood/energy input style and Hebrew font are design-phase decisions.** Data uses a 1–5 scale.

**D18. Git identity and credentials are repo-local.** Commits as `Noa <xnoatenx@gmail.com>`; pushes authenticate as `Noatenen` via a repo-local credential helper using `gh auth token --user Noatenen`. Global Git config and the active `gh` account (work) are never changed.
Why: the machine also hosts a work GitHub identity, which is the active `gh` account.

## 2026-10-06 — Pre-commit clarifications

**D19. `Day.dailyIntent?: string` stays in the model as optional.**
Why: allow a daily intention later without a migration. Not shown in the first check-in UI.

**D20. Life areas are a configurable default list, not an enum.** Defaults: work, body, mind, relationships, creativity, growth, travel, money. Tasks store an optional `areaId` string; labels live in `src/config/areas.ts`.
Why: labels will evolve; changing them must not require a data migration. · Alt: fixed list home/health/learning/creative/admin — rejected; TS union type — rejected as too rigid.

**D21. Workout kinds are config-driven strings.** v0.1 defaults: strength, yoga, walk, other.
Why: easy to add surfing, calisthenics, dance, etc. without migration.

**D22. Water is stored in milliliters.** UI may show liters (e.g. `1.4 / 2 L`). The soft goal lives in Settings as `waterGoalMl`. Quick-add amounts are a UI decision.
Why: precise, unit-independent; "glasses" is ambiguous. · Alt: glasses — rejected.

**D23. Today's blocks and time-of-day emphasis are a UX/design draft, not a locked decision.**
Why: to be refined while building and using Today.

## 2026-10-06 — Typography

**D24. Assistant is the UI font (resolves the font half of D17).** Self-hosted variable woff2 in `public/fonts/assistant/` (Hebrew + Latin subsets, weights 400–800; used: 400/600/700/800), declared in `src/styles/fonts.css`, exposed as `--font-ui` with system fallbacks. Text sizes sit ~1px above a typical system scale because Assistant draws smaller. No second decorative font yet; `--font-hand` stays a system stack.
Why: strong, readable Hebrew sans that pairs well with Latin; self-hosting keeps zero runtime third-party requests.
