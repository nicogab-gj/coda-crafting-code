import type pg from 'pg';
import { UserRepository, type UserData } from '../interfaces/user-repository.ts';

type UserRow = {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  country_of_residence: string;
};

class PostgresUserRepository extends UserRepository {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    super();
    this.pool = pool;
  }

  async getUserData(accountId: number): Promise<UserData | undefined> {
    const result = await this.pool.query<UserRow>(
      `SELECT users.id, users.firstname, users.lastname,
              to_char(users.birthdate, 'YYYY-MM-DD') AS birthdate, users.country_of_residence
       FROM users JOIN account ON account.user_id = users.id
       WHERE account.id = $1`,
      [accountId],
    );
    const row = result.rows[0];
    if (row === undefined) return undefined;

    return {
      id: Number(row.id),
      firstname: row.firstname,
      lastname: row.lastname,
      birthdate: row.birthdate,
      countryOfResidence: row.country_of_residence,
    };
  }
}

export { PostgresUserRepository };
