// The ONLY file in NoaOS that touches localStorage (decision D5).
// Everything above it (repositories, services, UI) goes through these functions,
// so swapping localStorage for something else later only changes this file.
// C# analogy: this is the DbContext.

/** Every NoaOS key starts with this prefix, e.g. "noaos:days". */
const PREFIX = 'noaos:'

/** Thrown when a stored value exists but is not valid JSON. The raw value is left untouched. */
export class StorageCorruptError extends Error {
  constructor(key: string) {
    super(`Stored value for "${PREFIX}${key}" is not valid JSON`)
    this.name = 'StorageCorruptError'
  }
}

/** Raw text for a key, or null if the key doesn't exist. */
export function readRaw(key: string): string | null {
  return localStorage.getItem(PREFIX + key)
}

/** Parsed JSON for a key, or undefined if the key doesn't exist. Never deletes anything. */
export function readJson(key: string): unknown {
  const raw = readRaw(key)
  if (raw === null) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    throw new StorageCorruptError(key)
  }
}

/**
 * Writes several keys as one unit: either all of them are saved, or none.
 * localStorage has no transactions, so we remember the old values first and
 * put them back if any write fails (e.g. the storage quota is full).
 */
export function writeJsonMany(values: Record<string, unknown>): void {
  // Serialize everything before touching storage, so a serialization error writes nothing.
  const serialized = Object.entries(values).map(([key, value]) => [key, JSON.stringify(value)] as const)
  const previous = serialized.map(([key]) => [key, readRaw(key)] as const)

  try {
    for (const [key, text] of serialized) {
      localStorage.setItem(PREFIX + key, text)
    }
  } catch (error) {
    for (const [key, oldText] of previous) {
      if (oldText === null) localStorage.removeItem(PREFIX + key)
      else localStorage.setItem(PREFIX + key, oldText)
    }
    throw error
  }
}
