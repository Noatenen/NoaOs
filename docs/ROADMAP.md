# Roadmap

> Purpose of this doc: sequence of work and the parking lot for future ideas. **Anything beyond v0.1 here is an idea, not a requirement.** Scope authority for v0.1 is [MVP.md](MVP.md).

## v0.1 milestones

| # | Milestone | Contents |
|---|---|---|
| 2A | Repository & docs | Repo-local Git setup, documentation foundation, `.gitignore` |
| M0 | Scaffold & shell | Vite + React + TS, RTL root, tokens, global CSS, router, navigation for all 7 + 2 areas with placeholders, font |
| M1 | Data foundation | `dates.ts` (+tests, 04:00 cutoff), storage + repositories, schema version + migrations, export/import, lazy Day creation |
| M2 | Today + Morning Check-in + Focus | Check-in flow incl. opt-in of yesterday's unfinished focus; Today composition |
| M3 | Tasks | Basic CRUD; due/linked tasks surface in Today |
| M4 | Me | Water, steps (soft goals + progress), workout/yoga; Life Stats in Today; goals in Settings |
| M5 | Quick Capture + Brain inbox | Global capture (text/links), Brain list with status/category |
| M6 | Work | Projects, start/stop sessions, reload-safe timer, reported marking, unreported indicator in Today |
| M7 | Evening Reflection, Rescue Me, Noa AI mock | `AIProvider` + `MockAIProvider`; drafted Hebrew copy for Noa's review |
| M8 | PWA & hosting | Manifest, icons, service worker; optional static HTTPS hosting |
| — | **v0.1 DoD check** | Full daily loop + reload + next-day + backup round-trip |

Noa Glass visual design evolves alongside from M0 and gets a focused pass once Today is real (after M2).

## Post-v0.1

1. **7 real days of use** → friction list → defines v0.2.

## Idea parking lot (unordered, not committed)

- What Should I Do? (time + energy → a few suggestions)
- Schedule in Today via calendar integration (Google Calendar)
- Apple Health / Apple Watch metrics; more Me metrics (sleep, mood trends, cycle, nutrition, weight, measurements)
- Images in Capture (requires IndexedDB); automatic capture categorization
- Free Journal and Intuitive Writing UIs; AI responses / follow-up questions; handwriting / Apple Pencil; photos; doodles
- Real AI provider for Noa AI
- My Noa: Mini Noa states, Chapter 26, achievements, collectibles, My Room
- Recurring tasks / gentle habits
- Notifications (e.g. work time-report reminder)
- Monthly / yearly recap
- Cloud sync / backend (e.g. Supabase) for multi-device
- WhatsApp capture bot, social media import, Screen Time
- Native iOS app, widgets

Possible future entities (not in v0.1): Goal, Habit, LifeArea, Achievement, Collectible, Memory, AIInsight.
