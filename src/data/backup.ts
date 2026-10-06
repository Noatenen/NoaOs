// JSON backup file: create (export), check (import step 1), restore (import step 2).
// Format (docs/DATA_MODEL.md → Backup format):
//   { "app": "NoaOS", "schemaVersion": 1, "exportedAt": "<Instant>", "data": { "days": [...] } }
import { isInstant, nowInstant, type Instant } from '../lib/dates'
import { loadAllData, writeAllData } from './database'
import { isSchemaVersion, migrateData, UnsupportedVersionError } from './migrations'
import { CURRENT_SCHEMA_VERSION, isPlainObject, validateNoaData, type NoaData } from './schema'

const BACKUP_APP = 'NoaOS'

export interface Backup {
  app: typeof BACKUP_APP
  schemaVersion: number
  exportedAt: Instant
  data: NoaData
}

/** What Noa sees before confirming an import. */
export interface BackupSummary {
  exportedAt: Instant
  schemaVersion: number
  dayCount: number
}

export type BackupProblem =
  | 'not-json' // not a JSON file at all
  | 'not-noaos' // JSON, but not a NoaOS backup
  | 'unsupported-version' // a NoaOS backup this version can't read (e.g. from a newer NoaOS)
  | 'invalid-data' // looks like a NoaOS backup, but its contents are broken

export type CheckedBackup =
  | { ok: true; data: NoaData; summary: BackupSummary }
  | { ok: false; problem: BackupProblem; detail: string }

/** Builds a backup object from everything currently stored. */
export function createBackup(now: Date = new Date()): Backup {
  return {
    app: BACKUP_APP,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: nowInstant(now),
    data: loadAllData(),
  }
}

/**
 * Fully checks a backup file's text WITHOUT touching stored data.
 * Older backups are migrated in memory. Only a fully valid result can be restored.
 */
export function checkBackup(text: string): CheckedBackup {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, problem: 'not-json', detail: 'File is not valid JSON' }
  }

  if (!isPlainObject(parsed) || parsed.app !== BACKUP_APP || !isPlainObject(parsed.data)) {
    return { ok: false, problem: 'not-noaos', detail: 'Missing "app": "NoaOS" or "data"' }
  }
  if (!isSchemaVersion(parsed.schemaVersion)) {
    return { ok: false, problem: 'unsupported-version', detail: `Bad schemaVersion: ${String(parsed.schemaVersion)}` }
  }
  if (!isInstant(parsed.exportedAt)) {
    return { ok: false, problem: 'invalid-data', detail: 'Bad exportedAt' }
  }

  let migrated
  try {
    migrated = migrateData(parsed.data, parsed.schemaVersion)
  } catch (error) {
    if (error instanceof UnsupportedVersionError) {
      return { ok: false, problem: 'unsupported-version', detail: error.message }
    }
    return { ok: false, problem: 'invalid-data', detail: String(error) }
  }

  // Strict: after migration, every collection this version requires must be present (D26).
  const result = validateNoaData(migrated)
  if (!result.ok) return { ok: false, problem: 'invalid-data', detail: result.error }

  return {
    ok: true,
    data: result.value,
    summary: {
      exportedAt: parsed.exportedAt,
      schemaVersion: parsed.schemaVersion,
      dayCount: result.value.days.length,
    },
  }
}

/** Replaces ALL stored data with the backup's data, all-or-nothing. Call only after confirmation. */
export function restoreBackup(data: NoaData): void {
  writeAllData(data)
}
