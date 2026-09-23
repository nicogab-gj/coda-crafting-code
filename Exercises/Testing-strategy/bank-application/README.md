# Bank Application

A minimal HTTP server in TypeScript, run natively by Node — no build step, no
`tsx`, no bundler. `node src/start.ts` runs the TypeScript directly.

## Requirements

Node 22.18 or later (native TypeScript support). Check with `node -v`.

Docker (with `docker compose`) for the Postgres database.

## Install

```bash
npm install
```

## Commands

| Command              | What it does                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| `npm run dev`        | Starts Postgres, migrates, seeds, then starts the server with `--watch` |
| `npm start`          | Starts the server once                                                  |
| `npm test`           | Runs the test suite once                                                |
| `npm run test:watch` | Re-runs tests on save — the red/green/refactor loop                     |
| `npm run typecheck`  | Type-checks the project (`tsc --noEmit`)                                |
| `npm run test:e2e`   | Runs the end-to-end tests: real server + test database                  |
| `npm run test:intg`  | Runs the integration tests against the Postgres DB                      |
| `npm run db:up`      | Starts Postgres in Docker and waits until it is ready                   |
| `npm run db:down`    | Stops Postgres (data is kept in a Docker volume)                        |
| `npm run db:reset`   | Deletes the data volume and starts from scratch                         |
| `npm run db:psql`    | Opens a `psql` shell on the dev database                                |
| `npm run db:migrate` | Applies pending migrations to the dev database                          |
| `npm run db:seed`    | Loads demo data into the dev database if it is empty                    |

The server listens on port 3000 by default. Override it with `PORT`:

```bash
PORT=4000 npm run dev
```

**Node strips types but does not check them**, so `npm run dev` will happily run
code that does not type-check. Run `npm run typecheck` (or keep it in watch mode
in a second terminal) — it is not optional here.

## Database

`docker-compose.yml` runs a single Postgres 17 container, exposed on host port
**5433** (so it does not clash with another Postgres on 5432). It holds two
databases:

| Database    | Used by                     | Connection string                               |
| ----------- | --------------------------- | ----------------------------------------------- |
| `bank`      | `npm run dev` / `npm start` | `postgres://bank:bank@localhost:5433/bank`      |
| `bank_test` | `npm run test:intg` / `test:e2e` | `postgres://bank:bank@localhost:5433/bank_test` |

`createPool()` in `src/db/database.ts` reads `DATABASE_URL`, falling back to the
dev database. The integration test config sets it to `bank_test`, so tests never
touch your dev data.

```bash
npm run db:up
npm run test:intg
```

Integration tests are named `*.intg.test.ts` and are excluded from `npm test`,
which stays fast and needs no Docker. If the container is not running, the
integration suite stops right away and tells you to run `npm run db:up`.

### Migrations

The schema lives in `src/db/migrations/*.sql`, applied in file name order by
`src/db/migrate.ts`. Each file runs in a transaction and is recorded in the
`schema_migrations` table, so it is applied only once. To change the schema, add
a new numbered file (`002_….sql`) — never edit one that has been applied.

- dev database: run `npm run db:migrate`
- test database: migrated automatically at the start of `npm run test:intg`

### Schema

| Table             | Columns                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `users`           | `id`, `firstname`, `lastname`, `birthdate` (date), `country_of_residence` (e.g. `FR`)     |
| `account`         | `id`, `user_id` → `users`, `amount` (numeric, default 0), `currency` (e.g. `EUR`)         |
| `account_history` | `id`, `account_id` → `account`, `amount` (numeric), `year` — one row per account and year |

### Schema conventions

Follow these rules when writing a new migration:

- **Table and column names are snake_case** (`country_of_residence`, `user_id`).
  Postgres folds unquoted identifiers to lowercase, so `countryOfResidence`
  would become `countryofresidence` unless quoted in every single query.
- **Never name a table after a reserved word.** `user` is reserved, hence
  `users`.
- **Ids are `bigint GENERATED ALWAYS AS IDENTITY`**: the database generates
  them, never the application.
- **Money is `numeric(19, 4)`, never a float**, so amounts are not rounded.
  `pg` returns `numeric` values as strings (`'1000.0000'`) to keep that
  precision: convert them deliberately in the application.
- **Codes follow ISO standards and are enforced with a `CHECK`**: countries are
  ISO 3166-1 alpha-2 (`FR`), currencies are ISO 4217 (`EUR`).
- **Every reference is a foreign key**, with an index on the referencing column.
  Deletes are not cascaded: a user or account cannot be deleted while rows still
  point to it.
- **Business rules the database can enforce, it enforces** (`NOT NULL`,
  `UNIQUE`, `CHECK`) — e.g. `account_history` has `UNIQUE (account_id, year)`.
- **Each constraint gets an integration test** in `src/db/migrate.intg.test.ts`.

### Demo data

`src/db/seed.sql` fills every table with demo data (5 users, 7 accounts in GBP, EUR
and USD, a few years of history). `npm run dev` loads it automatically, but
**only into an empty database**: data you add while developing survives a
restart. To go back to the demo data, run `npm run db:reset` then
`npm run dev`.

Ids are fixed (account `1` is Ada's GBP account), so you can rely on them when
testing by hand. The test database is never seeded: each test inserts the data
it needs.

SQL files in `src/db/init/` run **once**, when the data volume is first created
(that is where `bank_test` is created). After changing them, run
`npm run db:reset`.

## Endpoints

| Method | Path                    | Response                                                                                                                                  |
| ------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/health`               | `200` `{"status":"ok","uptimeInSeconds":12}`                                                                                              |
| `GET`  | `/accounts/:id/balance` | `200` `{"balance":1000}`, `404` `{"error":"Account not found"}`, `400` `{"error":"Invalid account id"}` when the id has 10 digits or more |
| _any_  | _anything_              | `404` `{"error":"Not found"}`                                                                                                             |

An unexpected error (e.g. the database is down) is logged and answered with
`500` `{"error":"Internal server error"}`.

Try them with the server running:

```bash
curl localhost:3000/health
curl localhost:3000/accounts/1/balance
curl -i localhost:3000/accounts/999/balance
curl -i localhost:3000/does-not-exist
```

## Layout

```
src/
├── app.ts                  createApp(accountController) — routing and 500s, returns a server that is not listening yet
├── http.ts                 HttpResponse type and respondWithJson()
├── controllers/
│   ├── account-controller.ts           AccountController — GET /accounts/:id/balance, returns { statusCode, body }
│   ├── account-controller.test.ts      unit tests — id validation, stubbed repository
│   └── account-controller.e2e.test.ts  e2e tests — 200 and 404s, real server + test database
├── start.ts                entry point — wires repository → service → controller, reads PORT and listens
├── app.test.ts             HTTP tests for /health, unknown routes and 500s — bind port 0, stubbed repository
├── services/
│   ├── account-service.ts       AccountService — getBalance(accountId), throws AccountNotFoundError
│   └── account-service.test.ts  unit tests for the service, stubbed repository
├── interfaces/
│   └── account-repository.ts    AccountRepository — abstract class, what the app needs from account storage
├── infrastructure/
│   ├── postgres-account-repository.ts            PostgresAccountRepository — AccountRepository backed by Postgres
│   └── postgres-account-repository.intg.test.ts  integration tests for the Postgres repository
├── db/                     everything about the database
│   ├── database.ts             createPool() — Postgres connection pool
│   ├── database.intg.test.ts   integration test against the dockerised Postgres
│   ├── migrate.ts              migrate() — applies pending migrations/*.sql files
│   ├── migrate.intg.test.ts    checks the schema and its constraints
│   ├── run-migrations.ts       entry point for `npm run db:migrate`
│   ├── migrations/             the schema, one numbered SQL file per change
│   ├── seed.ts                 seed() — loads seed.sql into an empty database
│   ├── seed.intg.test.ts       checks the seed only fills an empty database
│   ├── run-seed.ts             entry point for `npm run db:seed`
│   ├── seed.sql                demo data for local development
│   └── init/                   SQL run once when the Postgres volume is created
└── test/
    ├── database-fixtures.ts  test helpers — insertUser(), insertAccount(), truncateAllTables()
    ├── stub-account-repository.ts  in-memory AccountRepository for unit tests
    └── wait-for-database.ts  integration global setup — fails fast if the DB is down

docker-compose.yml          the Postgres container
```

`createApp()` returns a server that has not been bound to a port, so the tests
start their own on an ephemeral port (`server.listen(0)`) and read the real port
back from `server.address()`. Nothing collides with a dev server left running in
another terminal, and no `supertest` is needed — plain `fetch` against a real
socket.

Unit tests never touch the database: they give `AccountService` a
`StubAccountRepository`, an in-memory `AccountRepository` filled with the
amounts each test needs:

```ts
const accountService = new AccountService(new StubAccountRepository({ 1: 1000 }));
```

The real `PostgresAccountRepository` is covered by its own integration tests.

Each controller has two test files next to it. `*.test.ts` unit tests call it
directly with a stubbed repository (e.g. id validation) and run with
`npm test`. `*.e2e.test.ts` tests (`npm run test:e2e`) start the real server
process (`node src/start.ts`) against `bank_test`, insert the data each test
needs and call the route with `fetch`. Only what a real database cannot easily
produce, such as a failing repository for the 500, stays in `app.test.ts` with a
stub.

## What's Next

1. Enrich the `AccountService` with additional features such as the first name and last name of the account holder.

- Start in the service and write tests needing to retrieve information about the account holder, such as the first name and last name.
- create an abstract class for the account holder repository.
- use a test double for the account holder repository in unit tests.
- implement the real account holder repository through integration tests.

2. Let's move to another use case about transferring money between accounts.
   We will need a new service to handle money transfers between accounts.
   Use the same testing strategy as before: unit tests with a stub repository and integration tests with the real database.
   Then implement a controller and use a e2e test for the happy path scenario.

- Implement the following rules for money transfers:
  - The source account must have sufficient balance.
  - The transfer amount must be positive.
  - Both source and destination accounts must exist.
  - Both source and destination accounts must be in the same currency.
  - Transfer amount must be below 1000 units for same country and below 500 units for cross-country transfers.
