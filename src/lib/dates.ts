// The single source of truth for "which NoaOS day is it?".
// Rules (docs/TECH_ARCHITECTURE.md → Time & day rules):
//   - A NoaOS day runs from 04:00 local time until 03:59 the next morning.
//     So 01:30 on Tuesday still belongs to Monday.
//   - "Local time" is whatever timezone the browser runs in. No timezone
//     conversion code: the browser already knows Noa's timezone (incl. DST).
//   - DayKey = "YYYY-MM-DD" (which day?). Instant = ISO-8601 UTC string (when exactly?).
//   - We never store Date objects, only these strings.

/** A NoaOS day, e.g. "2026-10-06". */
export type DayKey = string

/** An exact moment as an ISO-8601 UTC string, e.g. "2026-10-06T07:12:00.000Z". */
export type Instant = string

/** Local hour at which a new NoaOS day starts. */
export const DAY_START_HOUR = 4

/** Builds a DayKey from calendar parts. `month` is 1–12 (not 0–11 like JS Date). */
function formatDayKey(year: number, month: number, day: number): DayKey {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

/**
 * Moves a calendar date by a number of days.
 * Uses UTC arithmetic on purpose: it is pure calendar math, so local DST
 * changes can never shift the result. Date.UTC handles month/year rollover
 * (e.g. day 0 of March = last day of February, including leap years).
 */
function addCalendarDays(year: number, month: number, day: number, delta: number): DayKey {
  const moved = new Date(Date.UTC(year, month - 1, day + delta))
  return formatDayKey(moved.getUTCFullYear(), moved.getUTCMonth() + 1, moved.getUTCDate())
}

/** Which NoaOS day does this moment belong to (in the browser's local time)? */
export function toDayKey(moment: Date | Instant): DayKey {
  const date = typeof moment === 'string' ? new Date(moment) : moment
  if (Number.isNaN(date.getTime())) {
    throw new Error(`toDayKey: invalid date "${String(moment)}"`)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // Before 04:00 → still the previous NoaOS day.
  if (date.getHours() < DAY_START_HOUR) {
    return addCalendarDays(year, month, day, -1)
  }
  return formatDayKey(year, month, day)
}

/** The NoaOS day right now. `now` is a parameter so tests can pass a fixed time. */
export function currentDayKey(now: Date = new Date()): DayKey {
  return toDayKey(now)
}

/** The day before a given DayKey ("2026-03-01" → "2026-02-28"). */
export function previousDayKey(dayKey: DayKey): DayKey {
  const { year, month, day } = parseDayKey(dayKey)
  return addCalendarDays(year, month, day, -1)
}

/** The current moment as an Instant string. */
export function nowInstant(now: Date = new Date()): Instant {
  return now.toISOString()
}

/** True for a well-formed DayKey that names a real calendar date. */
export function isDayKey(value: unknown): value is DayKey {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  // Round-trip check rejects dates like "2026-02-30".
  return addCalendarDays(year, month, day, 0) === value
}

/** True for an ISO-8601 UTC string as produced by Date.toISOString(). */
export function isInstant(value: unknown): value is Instant {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) return false
  return !Number.isNaN(Date.parse(value))
}

function parseDayKey(dayKey: DayKey): { year: number; month: number; day: number } {
  if (!isDayKey(dayKey)) {
    throw new Error(`Invalid DayKey "${dayKey}"`)
  }
  const [year, month, day] = dayKey.split('-').map(Number)
  return { year, month, day }
}
