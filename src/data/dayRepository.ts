// Loads and saves Day records (stored as one list under "noaos:days").
// No business rules here — those live in services/dayService.ts.
import type { Day } from '../domain/day'
import type { DayKey } from '../lib/dates'
import { loadAllData, saveCollection } from './database'

/** The stored Day for this dayKey, or null if Noa hasn't interacted with that day. */
export function getDay(dayKey: DayKey): Day | null {
  return loadAllData().days.find((day) => day.dayKey === dayKey) ?? null
}

/** Inserts the Day, or replaces the stored Day with the same dayKey. */
export function saveDay(day: Day): void {
  const days = loadAllData().days.filter((existing) => existing.dayKey !== day.dayKey)
  days.push(day)
  days.sort((a, b) => a.dayKey.localeCompare(b.dayKey))
  saveCollection('days', days)
}
