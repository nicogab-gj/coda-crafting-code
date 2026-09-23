-- `bank` is created by POSTGRES_DB and used by `npm run dev`.
-- `bank_test` is used by the integration tests, so they never touch dev data.
CREATE DATABASE bank_test OWNER bank;
