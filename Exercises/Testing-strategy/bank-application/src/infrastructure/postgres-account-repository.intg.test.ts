import type pg from 'pg';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { AccountRepository } from '../interfaces/account-repository.ts';
import { PostgresAccountRepository } from './postgres-account-repository.ts';
import { createPool } from '../db/database.ts';
import { truncateAllTables, insertAccount, insertUser } from '../test/database-fixtures.ts';

let pool: pg.Pool;
let accountRepository: AccountRepository;

beforeAll(() => {
  pool = createPool();
  accountRepository = new PostgresAccountRepository(pool);
});

afterEach(async () => {
  await truncateAllTables(pool);
});

afterAll(async () => {
  await pool.end();
});

describe('PostgresAccountRepository.getAmountById', () => {
  it('returns the amount of the account', async () => {
    const accountId = await insertAccount(pool, await insertUser(pool), 1234.56);

    expect(await accountRepository.getAmountById(accountId)).toBe(1234.56);
  });

  it('returns undefined when the account does not exist', async () => {
    expect(await accountRepository.getAmountById(999)).toBeUndefined();
  });
});
