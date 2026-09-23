import type pg from 'pg'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createPool } from './database.ts'
import { migrate } from './migrate.ts'
import { insertAccount, insertUser, truncateAllTables } from '../test/database-fixtures.ts'

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

describe('migrate', () => {
  it('does nothing when every migration is already applied', async () => {
    expect(await migrate(pool)).toEqual([])
  })

  it('stores a user, their account and its yearly history', async () => {
    const accountId = await insertAccount(pool, await insertUser(pool))
    await pool.query(`INSERT INTO account_history (account_id, amount, year) VALUES ($1, 800.5, 2025)`, [accountId])

    const result = await pool.query(
      `SELECT u.firstname, a.amount, a.currency, h.amount AS history_amount, h.year
       FROM users u
       JOIN account a ON a.user_id = u.id
       JOIN account_history h ON h.account_id = a.id`,
    )

    // pg returns numeric as a string, to avoid losing precision
    expect(result.rows).toEqual([
      { firstname: 'Ada', amount: '1000.0000', currency: 'EUR', history_amount: '800.5000', year: 2025 },
    ])
  })

  it('rejects an account for a user that does not exist', async () => {
    await expect(insertAccount(pool, 999)).rejects.toThrow(/foreign key/)
  })

  it('rejects a currency that is not an ISO 4217 code', async () => {
    const userId = await insertUser(pool)

    await expect(
      pool.query(`INSERT INTO account (user_id, amount, currency) VALUES ($1, 0, 'eu')`, [userId]),
    ).rejects.toThrow(/check constraint/)
  })

  it('rejects two history entries for the same account and year', async () => {
    const accountId = await insertAccount(pool, await insertUser(pool))
    const insertHistory = `INSERT INTO account_history (account_id, amount, year) VALUES ($1, 0, 2025)`
    await pool.query(insertHistory, [accountId])

    await expect(pool.query(insertHistory, [accountId])).rejects.toThrow(/unique constraint/)
  })
})
