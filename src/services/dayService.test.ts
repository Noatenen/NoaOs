import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryStorage } from '../test/memoryStorage'
import { getDay, updateDay } from './dayService'
import { saveDay } from '../data/dayRepository'
import { StoredDataError } from '../data/database'

let storage: MemoryStorage

beforeEach(() => {
  storage = new MemoryStorage()
  vi.stubGlobal('localStorage', storage)
})

const morning = new Date('2026-10-06T05:00:00.000Z')
const later = new Date('2026-10-06T09:30:00.000Z')

describe('Day persistence', () => {
  it('reading a day that does not exist returns null and writes nothing', () => {
    expect(getDay('2026-10-06')).toBeNull()
    expect(storage.length).toBe(0)
  })

  it('storage is lenient: a missing "days" key means no Days saved yet', () => {
    storage.setItem('noaos:schemaVersion', '1')
    expect(getDay('2026-10-06')).toBeNull()
  })

  it('creates the Day lazily on the first change', () => {
    const day = updateDay('2026-10-06', (d) => ({ ...d, dailyIntent: 'test intent' }), morning)
    expect(day).toEqual({
      dayKey: '2026-10-06',
      checkIn: null,
      checkInSkipped: false,
      dailyIntent: 'test intent',
      focusItems: [],
      createdAt: '2026-10-06T05:00:00.000Z',
      updatedAt: '2026-10-06T05:00:00.000Z',
    })
  })

  it('stores plain JSON with a schema version and reads it back', () => {
    updateDay(
      '2026-10-06',
      (d) => ({
        ...d,
        checkIn: { mood: 4, energy: 3, at: morning.toISOString() },
        focusItems: [{ id: 'f1', title: 'focus one', done: false }],
      }),
      morning,
    )

    expect(storage.getItem('noaos:schemaVersion')).toBe('1')
    const stored = JSON.parse(storage.getItem('noaos:days')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].checkIn.at).toBe('2026-10-06T05:00:00.000Z') // a string, not a Date

    // "Reload": a fresh read goes back to storage.
    expect(getDay('2026-10-06')?.focusItems[0].title).toBe('focus one')
  })

  it('keeps createdAt and updates updatedAt on later changes', () => {
    updateDay('2026-10-06', (d) => d, morning)
    const day = updateDay('2026-10-06', (d) => ({ ...d, checkInSkipped: true }), later)
    expect(day.createdAt).toBe(morning.toISOString())
    expect(day.updatedAt).toBe(later.toISOString())
    expect(getDay('2026-10-06')?.checkInSkipped).toBe(true)
  })

  it('keeps other days when saving one', () => {
    updateDay('2026-10-05', (d) => d, morning)
    updateDay('2026-10-06', (d) => d, morning)
    expect(getDay('2026-10-05')).not.toBeNull()
    expect(getDay('2026-10-06')).not.toBeNull()
  })

  it('refuses to save an invalid Day', () => {
    const tooMany = [1, 2, 3, 4].map((n) => ({ id: `f${n}`, title: `item ${n}`, done: false }))
    expect(() => updateDay('2026-10-06', (d) => ({ ...d, focusItems: tooMany }), morning)).toThrow(StoredDataError)
    expect(storage.length).toBe(0)
  })
})

describe('unreadable stored data is never overwritten', () => {
  it('corrupt JSON: reads and writes fail, bytes stay untouched', () => {
    storage.setItem('noaos:schemaVersion', '1')
    storage.setItem('noaos:days', '[{broken')
    expect(() => getDay('2026-10-06')).toThrow(StoredDataError)
    expect(() => updateDay('2026-10-06', (d) => d, morning)).toThrow(StoredDataError)
    expect(storage.getItem('noaos:days')).toBe('[{broken')
  })

  it('data from a newer schema version is left untouched', () => {
    storage.setItem('noaos:schemaVersion', '99')
    storage.setItem('noaos:days', '[]')
    expect(() => saveDay({
      dayKey: '2026-10-06', checkIn: null, checkInSkipped: false, focusItems: [],
      createdAt: morning.toISOString(), updatedAt: morning.toISOString(),
    })).toThrow(StoredDataError)
    expect(storage.getItem('noaos:schemaVersion')).toBe('99')
    expect(storage.getItem('noaos:days')).toBe('[]')
  })

  it('collections without a schema version are not treated as empty', () => {
    storage.setItem('noaos:days', '[]')
    expect(() => getDay('2026-10-06')).toThrow(StoredDataError)
  })
})
