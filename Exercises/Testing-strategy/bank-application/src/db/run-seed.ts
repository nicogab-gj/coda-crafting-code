import { createPool } from './database.ts'
import { seed } from './seed.ts'

const pool = createPool()

try {
  const applied = await seed(pool)

  console.log(applied ? 'seeded the database with demo data' : 'database already has data, seed skipped')
} finally {
  await pool.end()
}
