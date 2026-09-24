import { describe, expect, it } from 'vitest';
import { AccountNotFoundError, AccountService, UserNotFoundError } from './account-service.ts';
import { StubAccountRepository } from '../test/stub-account-repository.ts';
import { StubUserRepository } from '../test/stub-user-repository.ts';

describe('AccountService.getBalance', () => {
  it('returns the amount of the account and the user id', async () => {
    const stubAccountRepository = new StubAccountRepository({
      1: {
        balance: 1000,
        userId: 1,
      },
      2: { balance: 250.5, userId: 2 },
    });
    const stubUserRepository = new StubUserRepository({
      1: {
        firstName: 'John',
        lastName: 'Doe',
      },
      2: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    });
    const accountService = new AccountService(stubAccountRepository, stubUserRepository);

    expect(await accountService.getAccountInfo(2)).toEqual({
      balance: 250.5,
      firstName: 'Jane',
      lastName: 'Doe',
    });
  });

  it('throws AccountNotFoundError when the account does not exist', async () => {
    const stubUserRepository = new StubUserRepository({});
    const accountService = new AccountService(new StubAccountRepository(), stubUserRepository);

    await expect(accountService.getAccountInfo(999)).rejects.toThrow(AccountNotFoundError);
  });

  it('throw if user is not found', async () => {
    const stubAccountRepository = new StubAccountRepository({
      1: {
        balance: 1000,
        userId: 1,
      },
      2: { balance: 250.5, userId: 2 },
    });
    const stubUserRepository = new StubUserRepository({});
    const accountService = new AccountService(stubAccountRepository, stubUserRepository);

    await expect(accountService.getAccountInfo(1)).rejects.toThrow(UserNotFoundError);
  });
});
