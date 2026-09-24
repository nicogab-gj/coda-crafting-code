import type pg from 'pg';
import { UserRepository } from '../interfaces/user-repository.ts';

class PostgresUserRepository extends UserRepository {

  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getFirstNameById(userId: number): Promise<string | undefined> {
    // pg returns numeric as a string ('1234.5600') to avoid losing precision
    const result = await this.pool.query<{ amount: string }>('SELECT firstname FROM user WHERE id = $1', [userId]);
    const row = result.rows[0];

    return row === undefined ? undefined : String(row.amount);
  }

  
  async getLastNameById(userId: number): Promise<string | undefined> {
    // pg returns numeric as a string ('1234.5600') to avoid losing precision
    const result = await this.pool.query<{ user_id: string }>('SELECT lastname FROM user WHERE id = $1', [userId]);
    const row = result.rows[0];

    return row === undefined ? undefined : String(row.user_id);
  }

  
}

export { PostgresUserRepository };
