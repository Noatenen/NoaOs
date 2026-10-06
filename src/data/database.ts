// Ties storage + schema + migrations together. Repositories and backup read
// and write NoaOS data through here, so every read is validated and every
// write carries the schema version.
//
// Safety rule: if stored data is unreadable, unrecognized, or from a newer
// version, we throw StoredDataError and write NOTHING — the original bytes
// stay in localStorage untouched, so a later fix or a backup can still save them.
import { readJson, readRaw, writeJsonMany } from './storage'
import { migrateData, isSchemaVersion, type RawData } from './migrations'
import { COLLECTION_KEYS, CURRENT_SCHEMA_VERSION, validateNoaData, withEmptyCollections, type NoaData } from './schema'

const VERSION_KEY = 'schemaVersion'

export class StoredDataError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StoredDataError'
  }
}

/**
 * Makes sure stored data is at the current schema version, migrating it if it's older.
 * Safe to call any number of times. Doesn't write anything when nothing is stored yet.
 */
export function ensureCurrentSchema(): void {
  const version = readStoredVersion()

  if (version === undefined) {
    // Nothing stored yet is normal (fresh browser). Collections without a version are not.
    const hasCollections = COLLECTION_KEYS.some((key) => readRaw(key) !== null)
    if (hasCollections) throw new StoredDataError('Stored data has no schema version')
    return
  }
  if (version === CURRENT_SCHEMA_VERSION) return

  // Older (or newer) than this code. migrateData throws for newer versions.
  let migrated: RawData
  try {
    migrated = migrateData(readRawCollections(), version)
  } catch (error) {
    throw new StoredDataError(errorMessage(error))
  }
  const result = validateNoaData(withEmptyCollections(migrated))
  if (!result.ok) throw new StoredDataError(`Migrated data is invalid: ${result.error}`)
  writeAllData(result.value)
}

/** All stored data, validated. Returns empty collections when nothing is stored yet. */
export function loadAllData(): NoaData {
  ensureCurrentSchema()
  const result = validateNoaData(withEmptyCollections(readRawCollections()))
  if (!result.ok) throw new StoredDataError(`Stored data is invalid: ${result.error}`)
  return result.value
}

/** Saves one collection (plus the schema version) as a single all-or-nothing write. */
export function saveCollection<K extends keyof NoaData>(key: K, value: NoaData[K]): void {
  ensureCurrentSchema()
  const result = validateNoaData(withEmptyCollections({ ...readRawCollections(), [key]: value }))
  if (!result.ok) throw new StoredDataError(`Refusing to save invalid data: ${result.error}`)
  writeJsonMany({ [VERSION_KEY]: CURRENT_SCHEMA_VERSION, [key]: value })
}

/** Replaces ALL stored data in one all-or-nothing write. Used by backup import. */
export function writeAllData(data: NoaData): void {
  const result = validateNoaData(data)
  if (!result.ok) throw new StoredDataError(`Refusing to save invalid data: ${result.error}`)
  const values: Record<string, unknown> = { [VERSION_KEY]: CURRENT_SCHEMA_VERSION }
  for (const key of COLLECTION_KEYS) values[key] = result.value[key]
  writeJsonMany(values)
}

function readStoredVersion(): number | undefined {
  const version = readJsonSafely(VERSION_KEY)
  if (version === undefined) return undefined
  if (!isSchemaVersion(version)) throw new StoredDataError(`Unrecognized schema version: ${String(version)}`)
  return version
}

function readRawCollections(): RawData {
  const raw: RawData = {}
  for (const key of COLLECTION_KEYS) {
    const value = readJsonSafely(key)
    if (value !== undefined) raw[key] = value
  }
  return raw
}

function readJsonSafely(key: string): unknown {
  try {
    return readJson(key)
  } catch (error) {
    throw new StoredDataError(errorMessage(error))
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
