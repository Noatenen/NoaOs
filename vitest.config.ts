import { defineConfig } from 'vitest/config'

// Logic tests only (docs/TECH_ARCHITECTURE.md → Tests). Runs in plain Node, no browser.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // Day-key tests depend on local time: pin Noa's timezone (with DST) so they
    // behave the same on any machine.
    env: { TZ: 'Asia/Jerusalem' },
  },
})
