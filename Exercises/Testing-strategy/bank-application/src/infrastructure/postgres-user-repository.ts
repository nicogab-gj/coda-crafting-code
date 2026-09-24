import type pg from 'pg';
import { UserRepository } from '../interfaces/user-repository.ts';

class PostgresUserRepository extends UserRepository {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getNameById(userId: number): Promise<{ firstname: string; lastname: string } | undefined> {
    const result = await this.pool.query<{ firstname: string; lastname: string }>(
      'SELECT firstname, lastname FROM users WHERE id = $1',
      [userId],
    );

    return result.rows[0];
  }
}

export { PostgresUserRepository };