import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type pg from 'pg';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createPool } from '../db/database.ts';
import { insertAccount, insertUser, truncateAllTables } from '../test/database-fixtures.ts';
import { lstat } from 'node:fs';

const STARTUP_TIMEOUT_IN_MS = 10_000;

let pool: pg.Pool;
let serverProcess: ChildProcess;
let baseUrl: string;

beforeAll(async () => {
  pool = createPool();
  serverProcess = spawn('node', ['src/start.ts'], {
    // Project root, where `node src/start.ts` is run from
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    // DATABASE_URL is set to the test database by vitest.e2e.config.ts
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  baseUrl = await readListeningUrl(serverProcess);
}, STARTUP_TIMEOUT_IN_MS);

afterEach(async () => {
  await truncateAllTables(pool);
});

afterAll(async () => {
  await pool.end();

  if (serverProcess.exitCode !== null) return;

  const exited = new Promise(resolve => serverProcess.once('exit', resolve));
  serverProcess.kill();
  await exited;
});

function readListeningUrl(childProcess: ChildProcess): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = '';

    childProcess.stdout?.on('data', (chunk: Buffer) => {
      output += chunk.toString();

      const listeningUrl = output.match(/listening on (http:\/\/\S+)/);
      if (listeningUrl?.[1] !== undefined) resolve(listeningUrl[1]);
    });

    childProcess.stderr?.on('data', (chunk: Buffer) => reject(new Error(chunk.toString())));
    childProcess.once('error', reject);
    childProcess.once('exit', code => reject(new Error(`Server exited before listening (code ${code})`)));
  });
}

describe('AccountController: GET /accounts/:id/balance', () => {
  it('serves the account balance from the database through a real server process', async () => {
    const userId = await insertUser(pool);
    const accountId = await insertAccount(pool, userId, 1234.56);

    const response = await fetch(`${baseUrl}/accounts/${accountId}`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ balance: 1234.56, firstName: 'Ada', lastName: 'Lovelace' });
  });

  it('responds with 404 when the account does not exist', async () => {
    const response = await fetch(`${baseUrl}/accounts/999`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Account not found' });
  });

  it('responds with 404 when the id is not a number', async () => {
    const response = await fetch(`${baseUrl}/accounts/abc`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });
});
