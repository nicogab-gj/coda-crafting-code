import { createApp } from './app.ts';
import { AccountController } from './controllers/account-controller.ts';
import { createPool } from './db/database.ts';
import { PostgresAccountRepository } from './infrastructure/postgres-account-repository.ts';
import { PostgresUserRepository } from './infrastructure/postgres-user-repository.ts';
import { AccountService } from './services/account-service.ts';

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

const pool = createPool();

const accountService = new AccountService(new PostgresAccountRepository(pool), new PostgresUserRepository(pool));
const server = createApp(new AccountController(accountService));

server.listen(port, () => {
  const address = server.address();
  const boundPort = address !== null && typeof address !== 'string' ? address.port : port;

  console.log(`listening on http://localhost:${boundPort}`);
});
