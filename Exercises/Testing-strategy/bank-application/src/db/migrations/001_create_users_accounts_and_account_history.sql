-- `user` is a reserved word in Postgres, so the table is `users`.
-- Columns are snake_case: unquoted camelCase is folded to lowercase by Postgres.

CREATE TABLE users (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  firstname            text NOT NULL,
  lastname             text NOT NULL,
  birthdate            date NOT NULL,
  -- ISO 3166-1 alpha-2 country code, e.g. 'FR'
  country_of_residence char(2) NOT NULL CHECK (country_of_residence ~ '^[A-Z]{2}$')
);

CREATE TABLE account (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users (id),
  -- numeric, never float: money must not suffer rounding errors
  amount   numeric(19, 4) NOT NULL DEFAULT 0,
  -- ISO 4217 currency code, e.g. 'EUR'
  currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX account_user_id_idx ON account (user_id);

CREATE TABLE account_history (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES account (id),
  amount     numeric(19, 4) NOT NULL,
  year       smallint NOT NULL,
  -- One entry per account and year; also serves as the index on account_id
  UNIQUE (account_id, year)
);
