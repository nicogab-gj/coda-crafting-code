import type pg from 'pg';
import { AccountRepository, type Account } from '../interfaces/account-repository.ts';

class PostgresAccountRepository extends AccountRepository {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getAccountById(accountId: number): Promise<Account | undefined> {
    // pg returns numeric as a string ('1234.5600') to avoid losing precision
    const result = await this.pool.query<{ amount: string; user_id: string }>(
      'SELECT amount, user_id FROM account WHERE id = $1',
      [accountId],
    );
    const row = result.rows[0];

    return row === undefined
      ? undefined
      : {
          balance: Number(row.amount),
          userId: Number(row.user_id),
        };
  }
}

export { PostgresAccountRepository };
