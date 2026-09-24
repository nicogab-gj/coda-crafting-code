import type pg from 'pg';

async function truncateAllTables(pool: pg.Pool): Promise<void> {
  await pool.query('TRUNCATE account_history, account, users RESTART IDENTITY');
}

async function insertUser(pool: pg.Pool): Promise<number> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO users (firstname, lastname, birthdate, country_of_residence)
     VALUES ('Ada', 'Lovelace', '1815-12-10', 'GB') RETURNING id`,
  );

  return Number(result.rows[0]?.id);
}

async function insertAccount(pool: pg.Pool, userId: number, amount = 1000): Promise<number> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO account (user_id, amount, currency) VALUES ($1, $2, 'EUR') RETURNING id`,
    [userId, amount],
  );

  return Number(result.rows[0]?.id);
}

export { insertAccount, insertUser, truncateAllTables };
