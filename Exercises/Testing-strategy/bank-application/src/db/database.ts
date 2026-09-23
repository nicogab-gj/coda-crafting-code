import pg from 'pg'

const DEFAULT_DATABASE_URL = 'postgres://bank:bank@localhost:5433/bank'

function createPool(connectionString: string = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL): pg.Pool {
  return new pg.Pool({ connectionString })
}

export { createPool }
