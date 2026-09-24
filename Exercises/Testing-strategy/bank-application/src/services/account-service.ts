import type { Account, AccountRepository } from '../interfaces/account-repository.ts';
import type { UserRepository } from '../interfaces/user-repository.ts';

class AccountNotFoundError extends Error {
  constructor(accountId: number) {
    super(`Account ${accountId} not found`);
    this.name = 'AccountNotFoundError';
  }
}

class UserNotFoundError extends Error {
  constructor(userId: number) {
    super(`User ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

export type AccountInfo = {
  balance: number;
  firstName: string;
  lastName: string;
};

class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly userRepository: UserRepository;

  constructor(accountRepository: AccountRepository, userRepository: UserRepository) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async getAccountInfo(accountId: number): Promise<AccountInfo> {
    const account = await this.retrieveAccountAndThrowIfNotFound(accountId);

    const user = await this.retrieveUserAndThrowIfNotFound(account);

    return {
      balance: account.balance,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  private async retrieveUserAndThrowIfNotFound(account: Account) {
    const user = await this.userRepository.getNamesById(account.userId);
    if (user === undefined) {
      throw new UserNotFoundError(account.userId);
    }
    return user;
  }

  private async retrieveAccountAndThrowIfNotFound(accountId: number): Promise<Account> {
    const account = await this.accountRepository.getAccountById(accountId);
    if (account === undefined) throw new AccountNotFoundError(accountId);
    return account;
  }
}

export { AccountNotFoundError, UserNotFoundError, AccountService };
