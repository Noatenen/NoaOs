// New entity ids. crypto.randomUUID() is built into every modern browser —
// like Guid.NewGuid() in C#.
export function createId(): string {
  return crypto.randomUUID()
}
