import type pg from 'pg';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { UserRepository } from '../interfaces/user-repository.ts';
import { PostgresUserRepository } from './postgres-user-repository.ts';
import { createPool } from '../db/database.ts';
import { truncateAllTables, insertUser } from '../test/database-fixtures.ts';

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

describe('PostgresUserRepository.getNameById', () => {
  it('returns the firstname and lastname of the user', async () => {
    const userId = await insertUser(pool);

    expect(await userRepository.getNameById(userId)).toEqual({ firstname: 'Ada', lastname: 'Lovelace' });
  });

  it('returns undefined when the user does not exist', async () => {
    expect(await userRepository.getNameById(999)).toBeUndefined();
  });
});