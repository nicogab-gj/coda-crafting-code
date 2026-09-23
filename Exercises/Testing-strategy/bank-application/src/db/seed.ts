import { readFile } from 'node:fs/promises'
import type pg from 'pg'

const SEED_FILE = new URL('./seed.sql', import.meta.url)

// Loads `seed.sql` into an empty database. A database that already has users is
// left untouched, so data added while developing survives a server restart.
// Returns whether the seed was applied.
async function seed(pool: pg.Pool): Promise<boolean> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const users = await client.query('SELECT 1 FROM users LIMIT 1')
    if (users.rowCount !== 0) {
      await client.query('ROLLBACK')
      return false
    }

    await client.query(await readFile(SEED_FILE, 'utf8'))
    await client.query('COMMIT')
    return true
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export { seed }
