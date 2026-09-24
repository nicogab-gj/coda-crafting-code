import type pg from 'pg';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { UserRepository } from '../interfaces/user-repository.ts';
import { PostgresUserRepository } from './postgres-user-repository.ts';
import { createPool } from '../db/database.ts';
import { truncateAllTables, insertAccount, insertUser } from '../test/database-fixtures.ts';

let pool: pg.Pool;
let userRepository: UserRepository;

beforeAll(() => {
  pool = createPool();
  userRepository = new PostgresUserRepository(pool);
});

afterEach(async () => {
  await truncateAllTables(pool);
});

afterAll(async () => {
  await pool.end();
});

describe('PostgresUserRepository.getUserData', () => {
  it('returns the user owning the account', async () => {
    const userId = await insertUser(pool);
    const accountId = await insertAccount(pool, userId);

    expect(await userRepository.getUserData(accountId)).toEqual({
      id: userId,
      firstname: 'Ada',
      lastname: 'Lovelace',
      birthdate: '1815-12-10',
      countryOfResidence: 'GB',
    });
  });

  it('returns undefined when the account does not exist', async () => {
    expect(await userRepository.getUserData(999)).toBeUndefined();
  });
});
