# UX Architecture

> Purpose of this doc: how NoaOS is navigated and how Today is composed; key interaction flows; RTL interaction rules. Visual styling is in [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md); scope in [MVP.md](MVP.md).
>
> Hebrew labels below are **drafts** for Noa to review.

## Navigation

| Area (code name) | Draft Hebrew label | v0.1 state |
|---|---|---|
| `today` | היום | Built |
| `tasks` | משימות | Built (basic) |
| `me` | אני | Partial: water, steps, workout/yoga |
| `brain` | המוח | Partial: capture inbox list |
| `journal` | יומן | Partial: evening reflections |
| `work` | עבודה | Built (projects + sessions) |
| `my-noa` | נועה שלי | Placeholder |
| `noa-ai` *(secondary)* | Noa AI | Mock prototype |
| `settings` *(secondary)* | הגדרות | Goals + backup |

- **Desktop (≥ ~1024px):** persistent side navigation on the **right** (RTL start side). Primary areas on top, secondary (Noa AI, Settings) grouped lower.
- **Mobile/narrow:** bottom bar with the most-used areas (Today, Tasks, Brain, Work + "more"), the rest in a "more" sheet. Exact split decided in design.
- **Global actions** available from every screen: **Quick Capture** and **Rescue Me**. They must be reachable in one tap/click (and Quick Capture via a keyboard shortcut on desktop).
- **Placeholder areas** are honest: say what will live here, no fake data, no "locked" or guilt framing.

## Today — composition

Today owns almost no data; it **composes** data from other areas filtered by the current day key (see the 04:00 rule in [TECH_ARCHITECTURE.md](TECH_ARCHITECTURE.md)).

> **UX/design draft — not a locked product decision.** Blocks, ordering and time-of-day emphasis will be refined while building and using Today.

Draft blocks:

1. **Header** — Hebrew date, greeting appropriate to time of day.
2. **Morning Check-in** — prominent until done (or skipped); afterwards collapses into a small summary (mood/energy) that can be edited.
3. **Focus** — up to 3 items, the visual heart of the day.
4. **Next Up / Tasks** — tasks due today and task-linked focus items. Short, not the full task list.
5. **Work Session** — running timer (if any) or a quick start; gentle "unreported time" indicator.
6. **Life Stats** — water and steps with soft-goal progress; today's workout/yoga.
7. **Evening Reflection** — becomes prominent in the evening; shows "done" state afterwards.

Schedule (calendar) is part of the long-term Today but has no data source in v0.1 — do not show an empty schedule block.

### Time-of-day behaviour (draft)

| Time | Emphasis |
|---|---|
| 04:00 – ~12:00 | Check-in (if not done), Focus |
| ~12:00 – ~19:00 | Focus, Next Up, Work Session |
| ~19:00 – 03:59 | Evening Reflection, light summary of the day |

Nothing is ever hidden, only re-weighted.

### Returning after absence

If the last activity was several days ago, Today greets neutrally and starts fresh. No "you missed N days", no backlog dump. Optional: a single gentle offer to look at what was left open.

## Key flows

**Morning Check-in**
1. Mood (1–5) → 2. Energy (1–5) → 3. Focus: if yesterday's day has unfinished focus items, show them as optional suggestions to re-add (unchecked by default); add new items as free text or pick from tasks; max 3 → 4. Done → Today.
Skippable at any step. Editable later.

**Quick Capture**
Open (button/shortcut) → type text or paste a link → save. Under 3 seconds. Optional category. Lands in Brain inbox. No forced organization.

**Work Session**
Pick project (last used preselected) → Start. Timer displays elapsed time computed from the stored start time. Stop → session saved. Later: mark as reported (single or bulk).

**Rescue Me**
Open → pick a situation (5 options) → one tiny action is shown → options: "done", "another one", close. No lecture, no stats.

**Evening Reflection**
Short prompt(s) → free text → optional mood → save. One per day; reopen to edit.

**Backup**
Settings → Export (downloads JSON) / Import (pick file → show summary of what's inside → confirm replacement).

## Tone of states

- Empty states: inviting, not instructive walls of text.
- Completed goals: light celebration. Uncompleted goals: simply show progress — no red, no "failed", no "you only…".
- No streak counters.

## RTL interaction rules

- Reading and flow direction: right → left. "Start" = right, "end" = left. Primary actions sit where the reading flow ends for a group (decided per component, consistently).
- Directional icons (back/forward arrows, chevrons, progress direction) are **mirrored**. Non-directional icons (clock, check, play) are **not**.
- Progress bars fill from right to left.
- Numbers, times and the timer display stay LTR internally (`dir="ltr"` / `unicode-bidi: isolate` on the number), embedded in RTL text.
- Mixed Hebrew/English content (links, English task titles) uses bidi isolation so punctuation doesn't jump.
- Dates: Hebrew formatting via `Intl` (`he-IL`); week starts Sunday.
- Swipe gestures (if any) follow RTL direction.

## Responsiveness

Desktop-first but every screen is designed with a narrow layout in mind from the start. Blocks reflow into a single column on mobile; no desktop-only interactions (everything hover-revealed must also be tap-reachable). Respect iOS safe-area insets.
