# Product

> Purpose of this doc: the timeless *why* and *what* of NoaOS. Scope for a specific version lives in [MVP.md](MVP.md); future ideas live in [ROADMAP.md](ROADMAP.md).

## Vision

**"A personal operating system for being Noa."**

NoaOS is one external system that holds the different parts of Noa's life — what to do, what matters today, how Noa is doing, what's in progress, things saved, ideas, things to try, progress, work, health, reflection, memories and goals.

Noa has many interests, ambitions, projects and ideas at once. Information gets scattered across the calendar, WhatsApp, saved content, apps, notes and memory. Excitement moves from one thing to the next; things get forgotten, postponed, or pushed aside by whatever suddenly feels urgent. NoaOS holds the bigger picture **without requiring Noa to become a perfectly organized person**.

### What NoaOS is not

Not another productivity app, task manager, habit tracker, wellness app, generic dashboard, or SaaS product.

## Who it's for

Exactly one person: Noa. Personalization is a feature, not technical debt. Generalizing for other people is not a current requirement and should not shape decisions.

## Principles

1. **Rewards showing up, not being perfect.** Help Noa return after falling out of routine. A missed day creates no debt. No punitive streaks, failure messages or guilt. Soft goals and progress indicators are welcome — judgment is not.
2. **Hebrew-first / RTL-first.** RTL is the native direction of navigation, hierarchy, components, alignment, dates and interaction — not a localization layer.
3. **Flexible > perfect.** The system bends to real life.
4. **One system.** Tasks, schedule, health, journal, work, captures, memories and goals are parts of the same OS, not separate products.
5. **Today is the center.** Everything feeds into Today: tasks, schedule, health, work, captures, Morning Check-in (opens the day), Evening Reflection (closes it).
6. **Helpful, not controlling.** Offer a few useful choices and context instead of judging performance.
7. **Private by default.** Collect only what a feature needs. External integrations are explicit and deliberate.

## Product areas

Primary navigation (7) + secondary (2). UI labels are Hebrew; see [UX_ARCHITECTURE.md](UX_ARCHITECTURE.md) for draft labels.

| Area | Purpose |
|---|---|
| **Today** | The command center. *What's happening, what matters, what's next, how am I, what should I do now?* Hosts Morning Check-in, Focus, Schedule, Next Up, Work Session, Life Stats, Quick Capture, Rescue Me, Evening Reflection. |
| **Tasks** | Personal tasks, optionally tied to a life area or project, with priority, due date, estimate, status. Deliberately **not Jira**. |
| **Me** | Life statistics for awareness over time — water, steps, workouts, yoga, sleep, mood, energy, cycle, nutrition, weight, measurements, trends. Awareness, not scoring. |
| **Brain** | External brain / capture space: text, links, images, thoughts. Categories such as Recipes, Trips, Nails, Create, Projects, DJ, Learn, Wishlist, Ideas, Later. Long-term flow: **Saved → Organized → Actually used.** |
| **Journal** | Evening Reflection, Free Journal, Intuitive Writing. Later: AI responses, follow-up questions, handwriting, photos, doodles. |
| **Work** | A personal layer over work: projects, tasks, work sessions, timer, time tracking. **Does not connect work email. Does not replace the workplace time-reporting system** — it may track time and remind Noa to report it. |
| **My Noa** | The personal/gamified layer: Mini Noa, Chapter 26, achievements, collectibles, My Room (a "museum of the year"). Rewards participation and progress; never punishes inactivity. |
| Noa AI *(secondary)* | Conversational help. Never positioned as an "AI therapist". |
| Settings *(secondary)* | Preferences, backup (export/import). |

## Intelligent features (concepts)

- **What should I do?** Given available time (15 / 30 / 60 / 2h+) and energy (very low / okay / high), consider schedule, tasks, goals and saved ideas and return a **small number** of suggestions — never a giant list.
- **Rescue Me.** A permanent escape hatch for: no energy, overwhelmed, stuck scrolling, don't know where to begin, can't get started. The response is **a tiny next action, not a lecture**.

## Privacy

NoaOS will hold highly personal information (journal, mood, health, schedule, work, memories, AI conversations). Private by default; collect only what's needed; no personal data leaves the device unless an integration has been deliberately implemented and approved.
