import { createApp } from './app.ts';
import { AccountController } from './controllers/account-controller.ts';
import { createPool } from './db/database.ts';
import { PostgresAccountRepository } from './infrastructure/postgres-account-repository.ts';
import { PostgresUserRepository } from './infrastructure/postgres-user-repository.ts';
import { AccountHolderService } from './services/account-holder-service.ts';
import { AccountService } from './services/account-service.ts';
import { UserService } from './services/user-service.ts';

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

// Composition root: the only place that knows which implementation fills each port
const pool = createPool();
const accountHolderService = new AccountHolderService(
  new AccountService(new PostgresAccountRepository(pool)),
  new UserService(new PostgresUserRepository(pool)),
);
const server = createApp(new AccountController(accountHolderService));

server.listen(port, () => {
  const address = server.address();
  const boundPort = address !== null && typeof address !== 'string' ? address.port : port;

  console.log(`listening on http://localhost:${boundPort}`);
});
