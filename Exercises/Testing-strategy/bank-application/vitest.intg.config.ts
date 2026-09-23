import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.intg.test.ts'],
    globalSetup: ['src/test/wait-for-database.ts'],
    env: { DATABASE_URL: 'postgres://bank:bank@localhost:5433/bank_test' },
    // Test files share one database: run them one after the other
    fileParallelism: false,
  },
})
