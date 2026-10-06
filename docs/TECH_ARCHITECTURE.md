# Technical Architecture

> Purpose of this doc: how NoaOS is built and why. Entities and storage format are in [DATA_MODEL.md](DATA_MODEL.md). Decisions and their history are in [DECISIONS.md](DECISIONS.md).
>
> Guiding rule: **understandable over clever.** Noa knows HTML/CSS/JS/C#; React/TS are being learned. Analogies to C# are given where useful.

## Stack

| Piece | Choice | Why | Complexity it adds |
|---|---|---|---|
| Build/dev server | **Vite** | No server needed in v0.1. Feels like plain web: an `index.html` loads a script. Fast dev server; `npm run build` outputs static files hostable anywhere. | Minimal; one config file. |
| UI | **React** | Component model suits many small stateful widgets (check-in, counters, timer). | Learning JSX, hooks. |
| Language | **TypeScript** | Types and interfaces like C#; catches domain mistakes at compile time. Written in plain style — no clever generics. | Type annotations; a compile step (Vite handles it). |
| Routing | **React Router** | Maps URLs (`/today`, `/tasks`…) to screens; back button works. | One dependency. |
| Styling | **CSS Modules + plain global CSS + custom properties** | Full control over the custom visual language; readable. A `Card.module.css` file's class names are scoped to its component automatically (no naming collisions). | None beyond CSS. |
| Tests | **Vitest** (dev only) | For logic only: dates, services, migrations, backup. | Small. |

**Not used (and why):** Next.js (server features unused; hydration friction with localStorage/dates), Tailwind (less control/readability for this visual language), Redux/Zustand (not needed at this size), date libraries (`Intl` + small helpers suffice; Temporal not yet reliable on iOS Safari), CSS-in-JS, UI component kits.

### Dependency policy

Every dependency needs a stated reason and Noa's agreement, and is recorded in [DECISIONS.md](DECISIONS.md). Prefer native browser APIs (`Intl`, `crypto.randomUUID`, `localStorage`, `navigator.storage`, File/Blob for export).

## Layers

```
Components (features/*, components/*)     ← what you see; React
        │  calls
Services (services/*)                      ← business rules: "max 3 focus items",
        │  calls                             "one running work session", day rollover
Repositories (data/*Repository.ts)         ← load/save one kind of entity
        │  calls
Storage (data/storage.ts)                  ← the ONLY file that touches localStorage
```

C# analogy: services ≈ application service classes; repositories ≈ repository interfaces over a DbContext; `storage.ts` ≈ the DbContext itself. Swapping localStorage for IndexedDB or Supabase later means rewriting the bottom layer, not the UI.

**Rule:** components never import from `data/` and never call `localStorage`.

### State in the UI

No global state library. Each service exposes data plus a way to subscribe to changes; components read it through a small hook built on React's built-in `useSyncExternalStore`. C# analogy: a service that raises a `Changed` event, and views that subscribe to it. Introduce a library only if this demonstrably hurts.

## Time & day rules (critical)

- **Day key:** a string `"YYYY-MM-DD"` naming a NoaOS day.
- **04:00 cutoff:** local times 00:00–03:59 belong to the **previous** day. A reflection written at 01:30 on Tuesday belongs to Monday.
- **Timezone:** the device's local timezone (Noa: Asia/Jerusalem, with DST).
- **Instants** (`createdAt`, `startedAt`…) are stored as ISO-8601 UTC strings. **Never store JS `Date` objects.**
- All day-key logic lives in `src/lib/dates.ts` (`toDayKey(instant)`, `currentDayKey()`, `previousDayKey()`…) and is unit-tested, including DST transitions and the 04:00 edge.
- Today re-evaluates the current day key when the app regains focus/visibility, so leaving the tab open overnight still rolls over correctly.
- Display formatting uses `Intl.DateTimeFormat('he-IL', …)`.

## Timers

A running work session stores only `startedAt`. Elapsed time is always computed `now − startedAt` for display. No background counting — this survives reloads, sleep, and iOS suspending the app.

## AI boundary

```
Noa AI UI / Rescue Me
        ↓
AIProvider (interface)
        ↓
MockAIProvider   ← v0.1: small, mostly table-driven responses
RealAIProvider   ← future; not built
```

`AIProvider` is the **only** external-service boundary in v0.1. Calendar/Health/Notification providers are not created until those integrations are actually built. The mock exists to prototype UX, not to imitate a language model.

## Persistence

- localStorage, one key per collection, schema-versioned (details in DATA_MODEL).
- Call `navigator.storage.persist()` to reduce the chance of eviction.
- **Backup:** JSON export/import in Settings is a v0.1 requirement.
- Data is per browser/device. No sync in v0.1.

## PWA

Hand-written `manifest.webmanifest`, icons, and a small service worker that caches the app shell for offline use. No PWA plugin unless hand-writing proves painful. Not on the critical path for the DoD.

## Folder structure (planned)

```
index.html                  <html lang="he" dir="rtl">
public/                     manifest.webmanifest, icons/, sw.js, fonts/
src/
  main.tsx                  entry point
  app/                      App shell, router, layout (side nav / bottom bar)
  styles/                   reset.css, tokens.css, global.css
  components/               shared UI primitives (GlassPanel, Button, ProgressBar, Sheet…)
  features/                 one folder per product area: UI + feature hooks
    today/ checkin/ tasks/ me/ brain/ journal/ work/ rescue/ noa-ai/ my-noa/ settings/
  domain/                   entity types (pure TS — like C# records/POCOs)
  services/                 business logic per domain
  data/                     storage.ts, *Repository.ts, migrations.ts, backup.ts
  ai/                       AIProvider.ts, MockAIProvider.ts
  config/                   default lists & labels: areas.ts, workoutKinds.ts, metrics.ts
  lib/                      dates.ts, ids.ts, small helpers
```

## CSS conventions

- Global: `reset.css`, `tokens.css` (all design values), `global.css` (base typography, body background).
- Per component: `Component.module.css` next to `Component.tsx`.
- **Logical properties only** for direction-sensitive layout: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`, `border-start-start-radius`. No `left`/`right` for layout.
- Components use tokens, not raw values.

## Privacy

No analytics, trackers, third-party scripts, or remote fonts. No network calls carrying personal data in v0.1. The repository is public — never commit personal data or backups.

## Hosting (later)

Static hosting over HTTPS (proposed: GitHub Pages) when phone access is wanted (M8). Hosting serves code only; data stays in each browser.
