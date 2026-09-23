-- Demo data for local development, loaded by `npm run db:seed` (and before `npm run dev`).
-- Only applied to an empty database: see seed.ts.
-- Ids are fixed so they can be relied on when testing by hand, e.g. account 1.

INSERT INTO users (id, firstname, lastname, birthdate, country_of_residence) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Ada',    'Lovelace', '1815-12-10', 'GB'),
  (2, 'Alan',   'Turing',   '1912-06-23', 'GB'),
  (3, 'Grace',  'Hopper',   '1906-12-09', 'US'),
  (4, 'Marie',  'Curie',    '1867-11-07', 'FR'),
  (5, 'Linus',  'Torvalds', '1969-12-28', 'FI');

INSERT INTO account (id, user_id, amount, currency) OVERRIDING SYSTEM VALUE VALUES
  (1, 1,  1000.00, 'GBP'),
  (2, 1,   250.50, 'EUR'),
  (3, 2,     0.00, 'GBP'),
  (4, 3, 15420.75, 'USD'),
  (5, 4,  3200.00, 'EUR'),
  (6, 4,    -45.20, 'EUR'),
  (7, 5,   980.99, 'EUR');

INSERT INTO account_history (account_id, amount, year) VALUES
  (1,   800.00, 2023), (1,   900.00, 2024), (1,  1000.00, 2025),
  (2,   100.00, 2024), (2,   250.50, 2025),
  (3,    50.00, 2025),
  (4, 12000.00, 2023), (4, 14000.00, 2024), (4, 15420.75, 2025),
  (5,  2500.00, 2024), (5,  3200.00, 2025),
  (6,     0.00, 2025),
  (7,   500.00, 2024), (7,   980.99, 2025);

-- Explicit ids do not advance the identity sequences: move them past the seeded rows
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT max(id) FROM users));
SELECT setval(pg_get_serial_sequence('account', 'id'), (SELECT max(id) FROM account));
