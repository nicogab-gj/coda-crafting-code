import type pg from 'pg';
import { UserRepository, type User } from '../interfaces/user-repository.ts';

class PostgresUserRepository extends UserRepository {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getNamesById(userId: number): Promise<User | undefined> {
    const result = await this.pool.query<{ firstname: string; lastname: string }>(
      'SELECT firstname, lastname FROM users WHERE id=$1',
      [userId],
    );

    const row = result.rows[0];

    return row ? { firstName: row.firstname, lastName: row.lastname } : undefined;
  }
}

export { PostgresUserRepository };
