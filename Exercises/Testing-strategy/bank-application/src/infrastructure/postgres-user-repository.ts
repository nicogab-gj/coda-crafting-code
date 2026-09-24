import type pg from 'pg';
import { userRepository } from '../interfaces/user-repository.ts';

class PostgresUserRepository extends userRepository {
  private readonly pool: pg.Pool;
    constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }
  async getNameById(accountId: number): Promise<{firstname:string, lastname:string} | undefined> {
    // pg returns numeric as a string ('1234.5600') to avoid losing precision
    const result = await this.pool.query<{ firstname:string, lastname:string }>('SELECT users.firstname, users.lastname FROM account JOIN users ON users.id= account.user_id WHERE account.id = $1', [accountId]);
    const row = result.rows[0];

    return row === undefined ? undefined : row;
  }
}

export { PostgresUserRepository };