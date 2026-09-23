import type pg from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createPool } from './database.ts'

let pool: pg.Pool

beforeAll(() => {
  pool = createPool()
})

afterAll(async () => {
  await pool.end()
})

describe('database', () => {
  it('connects to the dockerised test database', async () => {
    const result = await pool.query<{ database: string }>('SELECT current_database() AS database')

    expect(result.rows[0]?.database).toBe('bank_test')
  })
})
