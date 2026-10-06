// App-level data housekeeping: preparing stored data on start, reporting
// unreadable data, and asking the browser to keep our storage.
import { loadAllData } from '../data/database'

/**
 * Runs once when NoaOS starts: upgrades stored data if it's from an older
 * schema, and asks the browser to keep it. Never throws — a problem with
 * stored data is reported (and left untouched), it doesn't stop the app.
 */
export function startAppData(): void {
  const problem = getStoredDataProblem()
  if (problem) console.error('NoaOS: stored data could not be read and was left untouched.', problem)
  void requestPersistentStorage()
}

/** null when stored data is fine (or empty); otherwise a technical description. */
export function getStoredDataProblem(): string | null {
  try {
    loadAllData() // migrates if needed, then reads and validates everything
    return null
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

export type PersistenceStatus = 'persisted' | 'not-persisted' | 'unsupported'

/**
 * Best effort: asks the browser not to evict NoaOS data when disk space is low.
 * Chrome decides silently (based on how much the site is used); some browsers ask.
 * Never throws.
 */
export async function requestPersistentStorage(): Promise<PersistenceStatus> {
  try {
    if (!navigator.storage?.persist) return 'unsupported'
    if (await navigator.storage.persisted()) return 'persisted'
    return (await navigator.storage.persist()) ? 'persisted' : 'not-persisted'
  } catch {
    return 'unsupported'
  }
}

/** Current persistence status, without asking for anything. Never throws. */
export async function getPersistenceStatus(): Promise<PersistenceStatus> {
  try {
    if (!navigator.storage?.persisted) return 'unsupported'
    return (await navigator.storage.persisted()) ? 'persisted' : 'not-persisted'
  } catch {
    return 'unsupported'
  }
}
