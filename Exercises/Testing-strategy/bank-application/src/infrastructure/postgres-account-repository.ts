import type pg from 'pg';
import { AccountRepository } from '../interfaces/account-repository.ts';

class PostgresAccountRepository extends AccountRepository {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getAmountById(accountId: number): Promise<number | undefined> {
    // pg returns numeric as a string ('1234.5600') to avoid losing precision
    const result = await this.pool.query<{ amount: string }>('SELECT amount FROM account WHERE id = $1', [accountId]);
    const row = result.rows[0];

    return row === undefined ? undefined : Number(row.amount);
  }
}

export { PostgresAccountRepository };
