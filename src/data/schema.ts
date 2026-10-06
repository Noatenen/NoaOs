// What a complete, valid set of NoaOS data looks like — used both for data
// read from localStorage and for data inside an imported backup.
// Validation is strict on purpose: it is the gate that stops broken data
// from being saved over good data.
import { MAX_FOCUS_ITEMS, type CheckIn, type Day, type FocusItem } from '../domain/day'
import { isDayKey, isInstant } from '../lib/dates'

/**
 * Bump this (and add a step in migrations.ts) whenever the shape of stored data changes.
 * Introducing a new collection also bumps it, with a migration that adds the collection
 * as an empty list (D26). That way the version says which collections must exist.
 */
export const CURRENT_SCHEMA_VERSION = 1

/** All stored NoaOS data. Collections are added here milestone by milestone. */
export interface NoaData {
  days: Day[]
}

/** The collection names, which are also their storage keys ("noaos:days"). */
export const COLLECTION_KEYS: (keyof NoaData)[] = ['days']

export function emptyData(): NoaData {
  return { days: [] }
}

/**
 * Browser storage only: a missing key for a current collection means nothing has
 * been saved in it yet (entities are created lazily), so it reads as an empty list.
 * Never used for backups — a backup must contain every collection its version requires.
 */
export function withEmptyCollections(raw: Record<string, unknown>): Record<string, unknown> {
  const filled = { ...raw }
  for (const key of COLLECTION_KEYS) {
    if (!(key in filled)) filled[key] = []
  }
  return filled
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string }

/**
 * Checks a loose object of collections (e.g. parsed JSON) and returns typed data.
 * Strict: every current collection must be present. A missing or malformed
 * collection fails the whole check — it is never silently turned into an empty one.
 * (Browser storage is lenient about missing keys; see withEmptyCollections.)
 */
export function validateNoaData(raw: unknown): ValidationResult<NoaData> {
  if (!isPlainObject(raw)) return fail('data is not an object')
  for (const key of COLLECTION_KEYS) {
    if (!(key in raw)) return fail(`missing collection "${key}"`)
  }

  const days = raw.days
  if (!Array.isArray(days)) return fail('days is not a list')

  const seen = new Set<string>()
  for (let i = 0; i < days.length; i++) {
    const error = dayError(days[i])
    if (error) return fail(`days[${i}]: ${error}`)
    const dayKey = (days[i] as Day).dayKey
    if (seen.has(dayKey)) return fail(`days: duplicate dayKey ${dayKey}`)
    seen.add(dayKey)
  }

  return { ok: true, value: { days: days as Day[] } }
}

/** Returns a short description of what is wrong with a Day, or null if it is valid. */
export function dayError(value: unknown): string | null {
  if (!isPlainObject(value)) return 'not an object'
  if (!isDayKey(value.dayKey)) return 'invalid dayKey'
  if (value.checkIn !== null && checkInError(value.checkIn)) return 'invalid checkIn'
  if (typeof value.checkInSkipped !== 'boolean') return 'invalid checkInSkipped'
  if (value.dailyIntent !== undefined && typeof value.dailyIntent !== 'string') return 'invalid dailyIntent'
  if (!Array.isArray(value.focusItems)) return 'focusItems is not a list'
  if (value.focusItems.length > MAX_FOCUS_ITEMS) return `more than ${MAX_FOCUS_ITEMS} focusItems`
  for (const item of value.focusItems) {
    if (focusItemError(item)) return 'invalid focus item'
  }
  if (!isInstant(value.createdAt)) return 'invalid createdAt'
  if (!isInstant(value.updatedAt)) return 'invalid updatedAt'
  return null
}

function checkInError(value: unknown): boolean {
  if (!isPlainObject(value)) return true
  const checkIn = value as Partial<CheckIn>
  if (!isInstant(checkIn.at)) return true
  if (checkIn.mood !== undefined && !isScale(checkIn.mood)) return true
  if (checkIn.energy !== undefined && !isScale(checkIn.energy)) return true
  return false
}

function focusItemError(value: unknown): boolean {
  if (!isPlainObject(value)) return true
  const item = value as Partial<FocusItem>
  if (typeof item.id !== 'string' || item.id === '') return true
  if (typeof item.title !== 'string') return true
  if (item.taskId !== undefined && typeof item.taskId !== 'string') return true
  if (typeof item.done !== 'boolean') return true
  if (item.doneAt !== undefined && !isInstant(item.doneAt)) return true
  if (item.fromDayKey !== undefined && !isDayKey(item.fromDayKey)) return true
  return false
}

function isScale(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 5
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error }
}
