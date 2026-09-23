import { createPool } from './database.ts'
import { migrate } from './migrate.ts'

const pool = createPool()

try {
  const appliedNames = await migrate(pool)

  console.log(appliedNames.length === 0 ? 'no pending migration' : `applied: ${appliedNames.join(', ')}`)
} finally {
  await pool.end()
}
