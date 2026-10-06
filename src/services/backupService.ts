// Backup actions for the Settings screen: download a backup file, check a
// chosen file, and (after Noa confirms) restore it.
import { checkBackup, createBackup, restoreBackup, type CheckedBackup } from '../data/backup'
import type { NoaData } from '../data/schema'
import { currentDayKey } from '../lib/dates'

export type { BackupProblem, BackupSummary, CheckedBackup } from '../data/backup'

/** Downloads all NoaOS data as "noaos-backup-YYYY-MM-DD.json". Throws if stored data can't be read. */
export function downloadBackup(now: Date = new Date()): void {
  const backup = createBackup(now)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `noaos-backup-${currentDayKey(now)}.json`
  link.click()

  // Give the browser a moment to start the download before releasing the file.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Reads and fully checks a chosen file. Changes nothing. */
export async function checkBackupFile(file: File): Promise<CheckedBackup> {
  return checkBackup(await file.text())
}

/** Replaces all current data with a checked backup's data. */
export function replaceDataWithBackup(data: NoaData): void {
  restoreBackup(data)
}
