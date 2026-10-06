// Evolving stored data from an older schema version to the current one.
// Used for data already in localStorage (on app start) and for older backups.
//
// How to add a migration later (when CURRENT_SCHEMA_VERSION goes 1 → 2):
//   1. Add one function to MIGRATIONS: it receives version-1 data, returns version-2 data.
//   2. Bump CURRENT_SCHEMA_VERSION in schema.ts.
//   3. Add a test for that function.
// Each step is a small pure function: plain objects in, plain objects out.
import { CURRENT_SCHEMA_VERSION } from './schema'

/** Loose stored data: collection name → parsed JSON, before validation. */
export type RawData = Record<string, unknown>

export type Migration = (data: RawData) => RawData

/**
 * MIGRATIONS[0] upgrades version 1 → 2, MIGRATIONS[1] upgrades 2 → 3, and so on.
 * Empty today: version 1 is the only schema that has ever existed.
 */
export const MIGRATIONS: Migration[] = []

/** Thrown when data's schema version can't be handled by this build of NoaOS. */
export class UnsupportedVersionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsupportedVersionError'
  }
}

export function isSchemaVersion(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1
}

/**
 * Runs every step from `fromVersion` up to the current version.
 * `steps` and `targetVersion` are parameters only so tests can exercise the runner.
 */
export function migrateData(
  data: RawData,
  fromVersion: number,
  steps: Migration[] = MIGRATIONS,
  targetVersion: number = CURRENT_SCHEMA_VERSION,
): RawData {
  if (!isSchemaVersion(fromVersion)) {
    throw new UnsupportedVersionError(`Invalid schema version: ${String(fromVersion)}`)
  }
  if (fromVersion > targetVersion) {
    throw new UnsupportedVersionError(
      `Data is from a newer NoaOS (schema ${fromVersion}); this version understands up to ${targetVersion}`,
    )
  }

  let result = data
  for (let version = fromVersion; version < targetVersion; version++) {
    const step = steps[version - 1]
    if (!step) throw new UnsupportedVersionError(`Missing migration ${version} → ${version + 1}`)
    result = step(result)
  }
  return result
}
