import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AccountRepository } from './interfaces/account-repository.ts';
import { AccountService } from './services/account-service.ts';
import { createApp } from './app.ts';
import { AccountController } from './controllers/account-controller.ts';
import { StubAccountRepository } from './test/stub-account-repository.ts';

class FailingAccountRepository extends AccountRepository {
  async getAmountById(): Promise<number | undefined> {
    throw new Error('database is down');
  }
}

async function startServer(accountRepository: AccountRepository): Promise<{ server: Server; baseUrl: string }> {
  const server = createApp(new AccountController(new AccountService(accountRepository)));
  await new Promise<void>(resolve => server.listen(0, resolve));

  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('Server is not listening on a TCP port');
  }

  return { server, baseUrl: `http://localhost:${address.port}` };
}

async function stopServer(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close(error => (error === undefined ? resolve() : reject(error)));
  });
}

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  ({ server, baseUrl } = await startServer(new StubAccountRepository()));
});

afterAll(async () => {
  await stopServer(server);
});

describe('GET /health', () => {
  it('reports the service as healthy', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: 'ok' });
  });
});

describe('unknown routes', () => {
  it('responds with 404', async () => {
    const response = await fetch(`${baseUrl}/does-not-exist`);

    expect(response.status).toBe(404);
  });
});

describe('unexpected errors', () => {
  it('responds with 500 when the balance cannot be read', async () => {
    const failing = await startServer(new FailingAccountRepository());
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const response = await fetch(`${failing.baseUrl}/accounts/1/balance`);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Internal server error' });
      expect(consoleError).toHaveBeenCalledWith(new Error('database is down'));
    } finally {
      consoleError.mockRestore();
      await stopServer(failing.server);
    }
  });
});
