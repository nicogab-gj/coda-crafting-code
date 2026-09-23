import pg from 'pg'
import { migrate } from '../db/migrate.ts'

const CONNECTION_STRING = 'postgres://bank:bank@localhost:5433/bank_test'

// Vitest global setup: fail fast with a useful message when the container is not running,
// then bring the test database schema up to date
export default async function waitForDatabase(): Promise<void> {
  const pool = new pg.Pool({ connectionString: CONNECTION_STRING })

  try {
    await pool.query('SELECT 1')
  } catch (error) {
    await pool.end()
    throw new Error(`Cannot reach the test database at ${CONNECTION_STRING}. Did you run \`npm run db:up\`?`, {
      cause: error,
    })
  }

  try {
    await migrate(pool)
  } finally {
    await pool.end()
  }
}
