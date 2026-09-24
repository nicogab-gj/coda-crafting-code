import type pg from 'pg';
import { createPool } from '../db/database';
import { insertUser, truncateAllTables } from '../test/database-fixtures';
import type { User, UserRepository } from '../interfaces/user-repository';
import { PostgresUserRepository } from './postgres-user-repository';

describe('User repository', () => {
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

  it('returns undefined if user is not found', async () => {
    const user = await userRepository.getNamesById(1);
    expect(user).toBeUndefined();
  });

  it('returns the requested user', async () => {
    const userId = await insertUser(pool);

    const user = await userRepository.getNamesById(userId);
    expect(user).toEqual<User>({
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });
});
