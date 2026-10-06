# MVP — v0.1

> Purpose of this doc: exactly what v0.1 is, how we know it's done, and what's explicitly out. Product vision is in [PRODUCT.md](PRODUCT.md); entity details in [DATA_MODEL.md](DATA_MODEL.md).

## Goal

**"I can actually use NoaOS."** Not the whole vision — one vertical slice that represents a real day.

## Device scope

- **Primary device:** Chrome on Noa's Mac. Desktop-first.
- **Responsive from the start:** layouts must adapt to tablet/phone widths without a later rewrite.
- PWA install / phone access is useful but secondary.
- **No cross-device sync.** Each browser/device has its own separate data. The UI must not imply otherwise.

## The daily loop (the slice)

1. **Morning** — open NoaOS. Morning Check-in: mood, energy, up to 3 Focus items. If yesterday had unfinished Focus items, the check-in **offers** them; Noa chooses which are still relevant. Today updates.
2. **During the day** — see Today; complete Focus items; create/complete basic tasks; log water and steps toward soft goals; log a workout or yoga; Quick Capture a thought or link; start/stop a Work Session; use Rescue Me when stuck.
3. **Night** — short Evening Reflection.
4. **Persistence** — closing and reopening Chrome loses nothing (including a running work timer).
5. **Next day** — after the 04:00 cutoff, a new Day/Today state appears; previous days remain stored.

## In scope

| Feature | Acceptance criteria |
|---|---|
| **Navigation shell** | All 7 primary areas + Noa AI + Settings are visible and navigable. Unbuilt areas show an honest placeholder ("coming soon"-style) state. RTL throughout. |
| **Today** | Shows: check-in state/prompt, Focus items, today's tasks (due today / linked to focus), Life Stats (water, steps, workout), Work Session status, Quick Capture entry, Rescue Me entry, Evening Reflection prompt (evening). Adapts to time of day (see UX_ARCHITECTURE). |
| **Morning Check-in** | Records mood + energy + 0–3 Focus items. Focus items are free text, optionally linked to an existing task. Offers yesterday's unfinished Focus items for opt-in; nothing is carried over automatically. Can be skipped; can be edited later in the day. |
| **Focus items** | Max 3 per day. Mark done/undone. Completing a task-linked item completes the task. |
| **Tasks** | Create, edit, complete, delete. Fields: title, optional project, optional life area, priority, due day, estimate. List with simple filtering (open/done). |
| **Water** | Quick-add amounts (stored in ml; displayed in ml/L, e.g. `1.4 / 2 L`). Soft daily goal (ml, from Settings) with a progress indicator. Can undo the last entry. |
| **Steps** | Manually set today's step count. Soft daily goal with progress. |
| **Workout / yoga** | Log kind (strength / yoga / walk / other) + optional duration + optional note. Shown in Today. |
| **Quick Capture** | Reachable from anywhere. **Text and links only.** Saved to Brain inbox. Brain shows a simple list of captures with status. |
| **Work** | Create work projects. Start/stop a session for a project. Timer survives reload. View sessions; mark sessions as reported. Today shows a gentle indicator of unreported time. |
| **Evening Reflection** | A short guided journal entry for the day (optional mood). One per day; editable. |
| **Rescue Me** | Choose a situation (no energy / overwhelmed / stuck scrolling / don't know where to begin / can't get started) → receive one tiny next action. Powered by `MockAIProvider` + drafted copy. |
| **Noa AI (mock)** | Minimal UI to prototype the experience via `MockAIProvider`. No real AI calls. |
| **Settings → Backup** | **Export** all data as a JSON file; **Import** a JSON backup (with confirmation, since it replaces current data). Required because browser storage is the only source of truth. |
| **Persistence** | All data in local browser storage behind the repository layer; schema-versioned. |
| **Basic PWA** | Manifest + icons + offline app shell, if it doesn't cost much. |

## Definition of Done

v0.1 is complete when Noa can successfully complete the full daily loop:

**Morning Check-in → use Today during the day → update core information/tasks/captures/work → Evening Reflection → close/reopen Chrome without losing data → return the next day and receive the correct new Day/Today state.**

Plus: export → import round-trips the data correctly.

## Post-v0.1 validation (not part of DoD)

Use NoaOS for **7 real days**. Collect friction. That list defines v0.2.

## Explicitly NOT in v0.1

Apple Health · Apple Watch · Google Calendar · WhatsApp bot · social media import · Screen Time · native iOS app · real AI model/API · Apple Pencil/handwriting · native widgets · My Room · collectibles engine · automatic capture categorization · monthly/yearly recap · cloud sync · authentication · multi-user · **images in Capture** · recurring tasks · notifications · tags.

## Microcopy

Claude may draft Hebrew microcopy; drafts are not source of truth. Noa reviews and edits product voice — especially Rescue Me, Noa AI, journal prompts and personality-heavy copy. Drafts should be clear and warm, not an imitation of how Noa talks.

## Open questions (design-phase; do not block architecture)

| Question | Current default / note |
|---|---|
| Mood & energy input style (emoji, words, scale visuals) | Data is a 1–5 scale; UI decided in design |
| Hebrew font | Self-hosted; decided in design |
| Soft goal values (water, steps) | Editable in Settings; initial values TBD by Noa |
| Water quick-add amounts (e.g. +250 ml) | Decided in UI/design work |
| Hosting/URL for phone access | Proposed: GitHub Pages at M8; not needed earlier |
| Today blocks & time-of-day emphasis | UX/design draft in UX_ARCHITECTURE; refined while building and using Today |
