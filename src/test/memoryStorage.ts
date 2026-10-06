// A stand-in for the browser's localStorage, so data-layer tests run in Node.
// `failWritesFor` makes setItem throw for one key — used to simulate a full disk.
export class MemoryStorage implements Storage {
  private items = new Map<string, string>()
  failWritesFor: string | null = null

  get length(): number {
    return this.items.size
  }

  clear(): void {
    this.items.clear()
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.items.delete(key)
  }

  setItem(key: string, value: string): void {
    if (key === this.failWritesFor) throw new Error('QuotaExceededError (simulated)')
    this.items.set(key, String(value))
  }
}
