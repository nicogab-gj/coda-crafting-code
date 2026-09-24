import type { AccountRepository } from '../interfaces/account-repository.ts';
import type { UserRepository } from '../interfaces/user-repository.ts';

class AccountNotFoundError extends Error {
  constructor(accountId: number) {
    super(`Account ${accountId} not found`);
    this.name = 'AccountNotFoundError';
  }
}

class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly userRepository: UserRepository;

  constructor(accountRepository: AccountRepository, userRepository: UserRepository) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async getBalance(accountId: number): Promise<number> {
    const amount = await this.accountRepository.getAmountById(accountId);
    if (amount === undefined) throw new AccountNotFoundError(accountId);

    return amount;
  }

  async getOwner(accountId: number): Promise<{ firstname: string; lastname: string } | undefined> {
    const userId = await this.accountRepository.getUserIdById(accountId);
    if (userId === undefined) throw new AccountNotFoundError(accountId);
    {
      return this.userRepository.getNameById(userId);
    }
  }
}

export { AccountNotFoundError, AccountService };
