import type pg from 'pg'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createPool } from './database.ts'
import { seed } from './seed.ts'
import { insertUser, truncateAllTables } from '../test/database-fixtures.ts'

let pool: pg.Pool

beforeAll(() => {
  pool = createPool()
})

afterEach(async () => {
  await truncateAllTables(pool)
})

afterAll(async () => {
  await pool.end()
})

async function countRows(table: string): Promise<number> {
  const result = await pool.query<{ count: string }>(`SELECT count(*) FROM ${table}`)

  return Number(result.rows[0]?.count)
}

describe('seed', () => {
  it('populates every table of an empty database', async () => {
    expect(await seed(pool)).toBe(true)

    expect(await countRows('users')).toBeGreaterThan(0)
    expect(await countRows('account')).toBeGreaterThan(0)
    expect(await countRows('account_history')).toBeGreaterThan(0)
  })

  it('leaves a database that already has users untouched', async () => {
    await insertUser(pool)

    expect(await seed(pool)).toBe(false)
    expect(await countRows('users')).toBe(1)
    expect(await countRows('account')).toBe(0)
  })

  it('keeps generating ids after the seeded ones', async () => {
    await seed(pool)

    await expect(insertUser(pool)).resolves.toBeGreaterThan(0)
  })
})
