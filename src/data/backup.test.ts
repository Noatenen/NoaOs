import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryStorage } from '../test/memoryStorage'
import { checkBackup, createBackup, restoreBackup } from './backup'
import type { Day } from '../domain/day'
import { loadAllData } from './database'

let storage: MemoryStorage

beforeEach(() => {
  storage = new MemoryStorage()
  vi.stubGlobal('localStorage', storage)
})

// Fictional sample data only — never real personal data in tests.
function sampleDay(dayKey: string): Day {
  return {
    dayKey,
    checkIn: { mood: 3, energy: 4, at: '2026-10-06T05:00:00.000Z' },
    checkInSkipped: false,
    focusItems: [{ id: 'f1', title: 'sample focus', done: true, doneAt: '2026-10-06T10:00:00.000Z' }],
    createdAt: '2026-10-06T05:00:00.000Z',
    updatedAt: '2026-10-06T10:00:00.000Z',
  }
}

function backupText(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    app: 'NoaOS',
    schemaVersion: 1,
    exportedAt: '2026-10-06T19:00:00.000Z',
    data: { days: [sampleDay('2026-10-05'), sampleDay('2026-10-06')] },
    ...overrides,
  })
}

function storeDays(days: Day[]) {
  storage.setItem('noaos:schemaVersion', '1')
  storage.setItem('noaos:days', JSON.stringify(days))
}

describe('export', () => {
  it('creates a recognizable, versioned backup of stored data', () => {
    storeDays([sampleDay('2026-10-06')])
    const backup = createBackup(new Date('2026-10-06T19:00:00.000Z'))
    expect(backup).toEqual({
      app: 'NoaOS',
      schemaVersion: 1,
      exportedAt: '2026-10-06T19:00:00.000Z',
      data: { days: [sampleDay('2026-10-06')] },
    })
  })

  it('round-trips: export → wipe → import restores the same data', () => {
    storeDays([sampleDay('2026-10-05'), sampleDay('2026-10-06')])
    const text = JSON.stringify(createBackup())
    storage.clear()

    const checked = checkBackup(text)
    expect(checked.ok).toBe(true)
    if (!checked.ok) return
    expect(checked.summary.dayCount).toBe(2)
    restoreBackup(checked.data)
    expect(loadAllData().days).toEqual([sampleDay('2026-10-05'), sampleDay('2026-10-06')])
  })
})

describe('import validation', () => {
  it.each([
    ['not JSON', 'hello', 'not-json'],
    ['a JSON array', '[]', 'not-noaos'],
    ['another app', backupText({ app: 'OtherApp' }), 'not-noaos'],
    ['missing data', backupText({ data: undefined }), 'not-noaos'],
    ['a newer schema', backupText({ schemaVersion: 2 }), 'unsupported-version'],
    ['a non-numeric schema', backupText({ schemaVersion: '1' }), 'unsupported-version'],
    ['a bad exportedAt', backupText({ exportedAt: 'yesterday' }), 'invalid-data'],
    ['a malformed day', backupText({ data: { days: [{ dayKey: '2026-02-30' }] } }), 'invalid-data'],
    ['duplicate days', backupText({ data: { days: [sampleDay('2026-10-06'), sampleDay('2026-10-06')] } }), 'invalid-data'],
    ['days that are not a list', backupText({ data: { days: {} } }), 'invalid-data'],
  ])('rejects %s', (_label, text, problem) => {
    const checked = checkBackup(text)
    expect(checked.ok).toBe(false)
    if (!checked.ok) expect(checked.problem).toBe(problem)
  })

  it('rejects a schema-v1 backup missing "days" and leaves stored data unchanged', () => {
    storeDays([sampleDay('2026-10-01')])
    const before = { version: storage.getItem('noaos:schemaVersion'), days: storage.getItem('noaos:days') }

    const checked = checkBackup(backupText({ data: {} }))
    expect(checked.ok).toBe(false)
    if (!checked.ok) expect(checked.problem).toBe('invalid-data')

    expect({ version: storage.getItem('noaos:schemaVersion'), days: storage.getItem('noaos:days') }).toEqual(before)
  })

  it('checking a backup never touches stored data', () => {
    storeDays([sampleDay('2026-10-01')])
    const before = storage.getItem('noaos:days')
    checkBackup(backupText({ data: { days: [{ broken: true }] } }))
    checkBackup(backupText())
    expect(storage.getItem('noaos:days')).toBe(before)
  })
})

describe('restore is all-or-nothing', () => {
  it('a failed write restores the previous data', () => {
    storeDays([sampleDay('2026-10-01')])
    const beforeDays = storage.getItem('noaos:days')
    const checked = checkBackup(backupText())
    if (!checked.ok) throw new Error('expected a valid backup')

    storage.failWritesFor = 'noaos:days' // schemaVersion is written first, then this fails
    expect(() => restoreBackup(checked.data)).toThrow()
    storage.failWritesFor = null

    expect(storage.getItem('noaos:days')).toBe(beforeDays)
    expect(storage.getItem('noaos:schemaVersion')).toBe('1')
  })

  it('a failed write on a fresh browser leaves nothing behind', () => {
    const checked = checkBackup(backupText())
    if (!checked.ok) throw new Error('expected a valid backup')
    storage.failWritesFor = 'noaos:days'
    expect(() => restoreBackup(checked.data)).toThrow()
    expect(storage.length).toBe(0)
  })

  it('a valid backup can replace unreadable stored data (after confirmation in the UI)', () => {
    storage.setItem('noaos:schemaVersion', '1')
    storage.setItem('noaos:days', '[{broken')
    const checked = checkBackup(backupText())
    if (!checked.ok) throw new Error('expected a valid backup')
    restoreBackup(checked.data)
    expect(loadAllData().days).toHaveLength(2)
  })
})
