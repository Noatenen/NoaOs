import { describe, expect, it } from 'vitest'
import { migrateData, UnsupportedVersionError, type Migration } from './migrations'
import { CURRENT_SCHEMA_VERSION } from './schema'

describe('migrateData', () => {
  it('leaves current-version data unchanged', () => {
    const data = { days: [] }
    expect(migrateData(data, CURRENT_SCHEMA_VERSION)).toBe(data)
  })

  it('runs steps in order up to the target version (test-only steps)', () => {
    const steps: Migration[] = [
      (data) => ({ ...data, log: ['1→2'] }),
      (data) => ({ ...data, log: [...((data.log as string[]) ?? []), '2→3'] }),
    ]
    expect(migrateData({}, 1, steps, 3)).toEqual({ log: ['1→2', '2→3'] })
    expect(migrateData({}, 2, steps, 3)).toEqual({ log: ['2→3'] })
  })

  it('rejects data from a newer version', () => {
    expect(() => migrateData({}, CURRENT_SCHEMA_VERSION + 1)).toThrow(UnsupportedVersionError)
  })

  it('rejects invalid versions', () => {
    expect(() => migrateData({}, 0)).toThrow(UnsupportedVersionError)
    expect(() => migrateData({}, 1.5)).toThrow(UnsupportedVersionError)
  })

  it('fails when a step is missing', () => {
    expect(() => migrateData({}, 1, [], 2)).toThrow(UnsupportedVersionError)
  })
})
