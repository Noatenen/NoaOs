import { describe, expect, it } from 'vitest'
import { currentDayKey, isDayKey, isInstant, previousDayKey, toDayKey } from './dates'

// new Date(year, monthIndex, day, hour, minute) builds a LOCAL time (monthIndex 0 = January).
const local = (y: number, m: number, d: number, h: number, min = 0) => new Date(y, m - 1, d, h, min)

describe('toDayKey — 04:00 cutoff', () => {
  it('runs in the pinned timezone', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('Asia/Jerusalem')
  })

  it('before 04:00 belongs to the previous day', () => {
    expect(toDayKey(local(2026, 10, 6, 0, 0))).toBe('2026-10-05')
    expect(toDayKey(local(2026, 10, 6, 1, 30))).toBe('2026-10-05')
    expect(toDayKey(local(2026, 10, 6, 3, 59))).toBe('2026-10-05')
  })

  it('at and after 04:00 belongs to the calendar day', () => {
    expect(toDayKey(local(2026, 10, 6, 4, 0))).toBe('2026-10-06')
    expect(toDayKey(local(2026, 10, 6, 12, 0))).toBe('2026-10-06')
    expect(toDayKey(local(2026, 10, 6, 23, 59))).toBe('2026-10-06')
  })

  it('crosses month and year boundaries', () => {
    expect(toDayKey(local(2026, 11, 1, 2, 0))).toBe('2026-10-31')
    expect(toDayKey(local(2027, 1, 1, 3, 0))).toBe('2026-12-31')
    expect(toDayKey(local(2027, 1, 1, 4, 0))).toBe('2027-01-01')
  })

  it('handles leap days', () => {
    expect(toDayKey(local(2028, 3, 1, 1, 0))).toBe('2028-02-29')
    expect(toDayKey(local(2028, 2, 29, 10, 0))).toBe('2028-02-29')
    expect(toDayKey(local(2027, 3, 1, 1, 0))).toBe('2027-02-28')
  })

  it('handles DST transitions (Israel 2026)', () => {
    // Spring forward, 27 Mar 2026: 02:00 → 03:00. 00:59Z = 03:59 local, 01:00Z = 04:00 local.
    expect(toDayKey('2026-03-27T00:59:00.000Z')).toBe('2026-03-26')
    expect(toDayKey('2026-03-27T01:00:00.000Z')).toBe('2026-03-27')
    // Fall back, 25 Oct 2026: 02:00 → 01:00, so 01:30 happens twice — both are still the 24th.
    expect(toDayKey('2026-10-24T22:30:00.000Z')).toBe('2026-10-24')
    expect(toDayKey('2026-10-24T23:30:00.000Z')).toBe('2026-10-24')
    // 04:00 local after fall back = 02:00Z.
    expect(toDayKey('2026-10-25T01:59:00.000Z')).toBe('2026-10-24')
    expect(toDayKey('2026-10-25T02:00:00.000Z')).toBe('2026-10-25')
  })

  it('accepts Instant strings and rejects invalid dates', () => {
    expect(toDayKey('2026-10-06T07:12:00.000Z')).toBe('2026-10-06')
    expect(() => toDayKey('not a date')).toThrow()
  })

  it('currentDayKey uses the given "now"', () => {
    expect(currentDayKey(local(2026, 10, 7, 2, 0))).toBe('2026-10-06')
  })
})

describe('previousDayKey', () => {
  it('steps back across month, year and leap boundaries', () => {
    expect(previousDayKey('2026-10-06')).toBe('2026-10-05')
    expect(previousDayKey('2026-03-01')).toBe('2026-02-28')
    expect(previousDayKey('2028-03-01')).toBe('2028-02-29')
    expect(previousDayKey('2027-01-01')).toBe('2026-12-31')
  })
})

describe('validators', () => {
  it('isDayKey accepts real dates only', () => {
    expect(isDayKey('2028-02-29')).toBe(true)
    expect(isDayKey('2027-02-29')).toBe(false)
    expect(isDayKey('2026-02-30')).toBe(false)
    expect(isDayKey('2026-1-5')).toBe(false)
    expect(isDayKey(20261006)).toBe(false)
  })

  it('isInstant accepts ISO UTC strings only', () => {
    expect(isInstant('2026-10-06T07:12:00.000Z')).toBe(true)
    expect(isInstant('2026-10-06T07:12:00+03:00')).toBe(false)
    expect(isInstant('2026-10-06')).toBe(false)
    expect(isInstant('2026-13-06T07:12:00.000Z')).toBe(false)
  })
})
