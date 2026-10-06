// Business rules for Days. The key rule here: a Day is created lazily — only
// when Noa actually changes something on that day. Just looking (getDay)
// never creates or saves anything.
import type { Day } from '../domain/day'
import { nowInstant, type DayKey } from '../lib/dates'
import * as dayRepository from '../data/dayRepository'

/** The Day for this dayKey, or null if nothing has happened on it yet. Never writes. */
export function getDay(dayKey: DayKey): Day | null {
  return dayRepository.getDay(dayKey)
}

/**
 * Changes a Day and saves it. If the Day doesn't exist yet, it is created first.
 * `change` receives the current Day and returns the new one (don't mutate — return a copy):
 *   updateDay(dayKey, (day) => ({ ...day, dailyIntent: 'one thing' }))
 */
export function updateDay(dayKey: DayKey, change: (day: Day) => Day, now: Date = new Date()): Day {
  const timestamp = nowInstant(now)
  const current = dayRepository.getDay(dayKey) ?? createEmptyDay(dayKey, timestamp)
  const updated: Day = { ...change(current), dayKey, createdAt: current.createdAt, updatedAt: timestamp }
  dayRepository.saveDay(updated)
  return updated
}

function createEmptyDay(dayKey: DayKey, timestamp: string): Day {
  return {
    dayKey,
    checkIn: null,
    checkInSkipped: false,
    focusItems: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
