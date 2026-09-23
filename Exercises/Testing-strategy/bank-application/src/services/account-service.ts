import type { AccountRepository } from '../interfaces/account-repository.ts';

class AccountNotFoundError extends Error {
  constructor(accountId: number) {
    super(`Account ${accountId} not found`);
    this.name = 'AccountNotFoundError';
  }
}

class AccountService {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async getBalance(accountId: number): Promise<number> {
    const amount = await this.accountRepository.getAmountById(accountId);
    if (amount === undefined) throw new AccountNotFoundError(accountId);

    return amount;
  }
}

export { AccountNotFoundError, AccountService };
