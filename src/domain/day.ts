// The Day entity (docs/DATA_MODEL.md → Day). Pure types, no logic —
// like C# records / POCOs.
import type { DayKey, Instant } from '../lib/dates'

/** Mood / energy on a 1–5 scale. The UI style is a design decision (D17). */
export type Scale = 1 | 2 | 3 | 4 | 5

export interface CheckIn {
  mood?: Scale
  energy?: Scale
  at: Instant
}

/** A focus item lives inside its Day; it has no life outside it. */
export interface FocusItem {
  id: string
  title: string
  taskId?: string
  done: boolean
  doneAt?: Instant
  /** Set when re-added from a previous day's unfinished items. */
  fromDayKey?: DayKey
}

export const MAX_FOCUS_ITEMS = 3

/** Created lazily — only when Noa actually interacts with that day. */
export interface Day {
  dayKey: DayKey
  /** null until the check-in is done. */
  checkIn: CheckIn | null
  /** Skipping is a valid choice, not a failure. */
  checkInSkipped: boolean
  dailyIntent?: string
  focusItems: FocusItem[]
  createdAt: Instant
  updatedAt: Instant
}
