# Data Model — v0.1

> Purpose of this doc: the entities NoaOS stores, their fields, ownership and relationships, plus storage, migration and backup formats. Layering and time rules are in [TECH_ARCHITECTURE.md](TECH_ARCHITECTURE.md).

## Conventions

- **No `userId`** anywhere — single user.
- `id`: string from `crypto.randomUUID()`.
- `DayKey`: `"YYYY-MM-DD"` — a NoaOS day, using the **04:00 cutoff**. Answers *"which day does this belong to?"*
- `Instant`: ISO-8601 UTC string (e.g. `"2026-10-06T07:12:00.000Z"`). Answers *"when exactly?"*
- Every entity that surfaces in Today carries a `dayKey`, so Today = "query each domain where `dayKey` = today".
- Every stored entity has `createdAt` and `updatedAt` (cheap now; needed for any future sync).
- Absence of data is just absence. Nothing stores "missed", "failed" or streak state.
- Derived values (totals, durations, "done for the day") are computed, not stored.

## Entities

### Day
Owns the morning check-in and focus items. Created **lazily** — only when Noa interacts with that day.

| Field | Type | Notes |
|---|---|---|
| `dayKey` | DayKey | Primary key |
| `checkIn` | `{ mood?: 1–5; energy?: 1–5; at: Instant } \| null` | null until check-in done; editable |
| `checkInSkipped` | boolean | Skipping is a valid choice, not a failure |
| `dailyIntent` | string? | Optional daily intention. In the model now; not shown in the first check-in UI |
| `focusItems` | `FocusItem[]` | 0–3 |
| `createdAt`, `updatedAt` | Instant | |

`FocusItem` (embedded in Day — it has no life outside its day):

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `title` | string | Free text |
| `taskId` | string? | Optional link to a Task |
| `done` | boolean | |
| `doneAt` | Instant? | |
| `fromDayKey` | DayKey? | Set if re-added from a previous day's unfinished items |

Rules: max 3 items. Completing a task-linked item also completes the task. Unfinished items are **never** auto-copied; the next check-in may offer them for opt-in.

Removed from the initial proposal: `completed` (judgment-like and ambiguous; replaced by derived facts), `date` (→ `dayKey`). `dailyIntent` is kept as an **optional** field so a daily intention can be added to the UI later without a migration.

### Task

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `title` | string | |
| `notes` | string? | |
| `projectId` | string? | → Project |
| `areaId` | string? | Optional. A life-area id from the area config (see [Life areas](#life-areas)) — a plain string, not an enum |
| `priority` | `'low' \| 'normal' \| 'high'` | Default `normal` |
| `status` | `'open' \| 'done'` | |
| `dueDayKey` | DayKey? | |
| `estimateMinutes` | number? | |
| `completedAt` | Instant? | |
| `createdAt`, `updatedAt` | Instant | |

Removed: `recurring` (needs a real engine; post-v0.1). Personal vs work tasks: same entity; a work task has a work project.

### Project
Needed so tasks and work sessions reference something stable instead of free text.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `name` | string | |
| `kind` | `'work' \| 'personal'` | |
| `color` | string? | Token name, not hex |
| `archived` | boolean | |
| `createdAt`, `updatedAt` | Instant | |

### MetricEntry
Generic numeric measurements. v0.1 types: `water`, `steps`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `type` | `'water' \| 'steps'` | Extended later (sleep, weight…) |
| `value` | number | |
| `dayKey` | DayKey | |
| `at` | Instant | |
| `source` | `'manual'` | Seam for future `'apple-health'` |
| `createdAt`, `updatedAt` | Instant | |

Semantics differ by type (defined in a metric config in code, together with unit and label):
- **water** — *additive*: each entry is an increment **in milliliters** (e.g. `250`). Daily total = sum. Undo = delete last entry. The UI may display liters (e.g. `1.4 / 2 L`); quick-add amounts are a UI decision.
- **steps** — *daily total*: setting steps writes an entry; the day's value = latest entry.

`unit` is not stored per entry — it comes from the metric config.

### WorkoutEntry
Separate from MetricEntry because a workout is an event, not a number.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `kind` | string | A workout-kind id from config. v0.1 defaults: `strength`, `yoga`, `walk`, `other`. Plain string so new kinds (surfing, calisthenics, dance…) are a config change, not a migration |
| `durationMinutes` | number? | |
| `note` | string? | |
| `dayKey` | DayKey | |
| `at` | Instant | |
| `source` | `'manual'` | |
| `createdAt`, `updatedAt` | Instant | |

### Capture

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `kind` | `'text' \| 'link'` | **Images deferred** until storage supports them (IndexedDB) |
| `content` | string | The text, or an optional note for a link |
| `url` | string? | Required when `kind = 'link'` |
| `title` | string? | |
| `category` | `CaptureCategory`? | Manual, optional; fixed list (Recipes, Trips, Nails, Create, Projects, DJ, Learn, Wishlist, Ideas, Later) |
| `status` | `'inbox' \| 'organized' \| 'used' \| 'archived'` | Saved → Organized → Actually used |
| `dayKey` | DayKey | Day it was captured |
| `createdAt`, `updatedAt` | Instant | |

### JournalEntry

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `type` | `'evening' \| 'free' \| 'intuitive'` | v0.1 UI builds `evening` only |
| `dayKey` | DayKey | Max one `evening` entry per day |
| `prompt` | string? | The prompt shown, if any |
| `content` | string | |
| `mood` | 1–5? | Evening mood (distinct from morning check-in mood) |
| `createdAt`, `updatedAt` | Instant | |

Removed: `tags` (post-v0.1). Evening Reflection lives here, not on Day.

### WorkSession

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `projectId` | string | → Project (kind `work`) |
| `startedAt` | Instant | |
| `endedAt` | Instant \| null | **null = running**; survives reload |
| `note` | string? | |
| `reportedAt` | Instant? | When Noa reported it in the workplace system |
| `dayKey` | DayKey | Day of `startedAt`; sessions crossing midnight belong to the start day |
| `createdAt`, `updatedAt` | Instant | |

Rules: at most one running session. Duration is derived (`endedAt − startedAt`), never stored.

### Settings
Single object.

| Field | Type | Notes |
|---|---|---|
| `waterGoalMl` | number | Soft daily water goal in ml (e.g. 2000) |
| `stepsGoal` | number | Soft goal |
| `updatedAt` | Instant | |

## Configurable lists (code config, not entities)

Some lists need labels that can evolve without touching stored data. Pattern: **entities store a stable English id string; the config maps id → Hebrew label (and optional color/icon).** Renaming a label or reordering is a config edit; adding an item is a config edit. TypeScript type for these fields is `string`, not a union/enum. If an entity holds an id that's no longer in config, the UI shows it as a generic/"other" item rather than failing.

Config lives in `src/config/` (e.g. `areas.ts`, `workoutKinds.ts`, `metrics.ts`). Making these editable by Noa in Settings is possible later (the list would then move into storage) — not v0.1.

### Life areas

Default list (ids; Hebrew labels are drafts in config):

| id | Concept |
|---|---|
| `work` | Work |
| `body` | Body / me |
| `mind` | Mind |
| `relationships` | Relationships |
| `creativity` | Creativity |
| `growth` | Growth |
| `travel` | Big trip / travel |
| `money` | Money |

Tasks may have an optional `areaId`. A `LifeArea` entity is not needed in v0.1.

### Workout kinds

Defaults: `strength`, `yoga`, `walk`, `other`. Extend by adding to config.

## Ownership & relationships

```
Day ──embeds── FocusItem ──optional──▶ Task
Task ──optional──▶ Project
WorkSession ─────▶ Project (work)
MetricEntry / WorkoutEntry / Capture / JournalEntry / WorkSession ── dayKey ──▶ (a day; Day record may not exist)
```

`dayKey` is a value, not a foreign key: entries can exist for a day that has no Day record (e.g. water logged without a check-in). Deleting a Project archives it rather than deleting, so sessions keep their reference. Deleting a Task clears `taskId` on any focus item that referenced it.

## Storage

- localStorage, accessed **only** through `src/data/storage.ts`.
- One key per collection, prefixed: `noaos:days`, `noaos:tasks`, `noaos:projects`, `noaos:metrics`, `noaos:workouts`, `noaos:captures`, `noaos:journal`, `noaos:workSessions`, `noaos:settings`.
- `noaos:schemaVersion` — integer, starts at `1`.
- Collections are created as their milestone is built (M1: `noaos:days`). Introducing a collection bumps `schemaVersion`, with a migration that adds it as empty (D26). In storage, a missing key for a current collection means nothing has been saved in it yet.
- Stored data that can't be read (invalid JSON, unknown or newer schema version, failed validation) is **never overwritten automatically**; NoaOS reports it and leaves the bytes untouched. Only an explicitly confirmed backup import may replace it.
- Values are JSON arrays of entities (or one object for settings).
- Expected v0.1 volume (text only) is far below localStorage's ~5MB limit. Images would not be — hence IndexedDB before images.

## Migrations

On app start, `migrations.ts` compares the stored `schemaVersion` with the code's version and runs ordered migration steps (`1 → 2`, `2 → 3`…). Each step is a small pure function, unit-tested. Never change the shape of stored data without adding a migration.

## Backup format

Export produces one JSON file (`noaos-backup-YYYY-MM-DD.json`, git-ignored):

```json
{
  "app": "NoaOS",
  "schemaVersion": 1,
  "exportedAt": "2026-10-06T19:00:00.000Z",
  "data": {
    "days": [], "tasks": [], "projects": [], "metrics": [], "workouts": [],
    "captures": [], "journal": [], "workSessions": [], "settings": {}
  }
}
```

Import: validate `app` and `schemaVersion`, run migrations if older, show a summary (counts per collection), and replace current data only after confirmation. Validation and migration happen entirely in memory before anything is written, and the replacement is all-or-nothing: if any write fails, the previous values are put back. A backup must contain every collection its `schemaVersion` requires: a collection introduced in a later version is added (empty) by migration, but a required collection that is missing makes the backup invalid (D26).
