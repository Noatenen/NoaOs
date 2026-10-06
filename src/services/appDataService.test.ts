import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryStorage } from '../test/memoryStorage'
import { getStoredDataProblem } from './appDataService'

let storage: MemoryStorage

beforeEach(() => {
  storage = new MemoryStorage()
  vi.stubGlobal('localStorage', storage)
})

describe('getStoredDataProblem', () => {
  it('reports nothing for a fresh browser and writes nothing', () => {
    expect(getStoredDataProblem()).toBeNull()
    expect(storage.length).toBe(0)
  })

  it('reports corrupt collection contents, not just a bad version', () => {
    storage.setItem('noaos:schemaVersion', '1')
    storage.setItem('noaos:days', '[{broken')
    expect(getStoredDataProblem()).not.toBeNull()
    expect(storage.getItem('noaos:days')).toBe('[{broken')
  })
})
