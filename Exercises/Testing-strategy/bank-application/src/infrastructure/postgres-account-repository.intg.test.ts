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
  it('returns the requested account', async () => {
    const userId = await insertUser(pool);
    const accountId = await insertAccount(pool, userId, 1234.56);

    expect(await accountRepository.getAccountById(accountId)).toEqual({
      balance: 1234.56,
      userId,
    });
  });

  it('returns undefined when the account does not exist', async () => {
    expect(await accountRepository.getAccountById(999)).toBeUndefined();
  });
});
