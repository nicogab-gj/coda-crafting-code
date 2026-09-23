import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type pg from 'pg'

const MIGRATIONS_DIRECTORY = fileURLToPath(new URL('./migrations/', import.meta.url))
// Any constant works: it only has to be the same for every process running migrations
const MIGRATION_LOCK_ID = 7_342_001

// Applies, in file name order, every `migrations/*.sql` file not applied yet.
// Each file runs in its own transaction and is recorded in `schema_migrations`.
async function migrate(pool: pg.Pool): Promise<string[]> {
  const client = await pool.connect()

  try {
    // Two processes migrating at once (e.g. parallel test runs) must not apply a file twice
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID])
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const applied = await client.query<{ name: string }>('SELECT name FROM schema_migrations')
    const appliedNames = new Set(applied.rows.map((row) => row.name))
    const pendingNames = (await readdir(MIGRATIONS_DIRECTORY))
      .filter((name) => name.endsWith('.sql') && !appliedNames.has(name))
      .sort()

    for (const name of pendingNames) {
      const sql = await readFile(`${MIGRATIONS_DIRECTORY}${name}`, 'utf8')

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
        await client.query('COMMIT')
      } catch (error) {
        await client.query('ROLLBACK')
        throw new Error(`Migration ${name} failed`, { cause: error })
      }
    }

    return pendingNames
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID])
    client.release()
  }
}

export { migrate }
