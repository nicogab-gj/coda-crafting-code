import type { AccountRepository } from '../interfaces/account-repository.ts';
import {userRepository} from '../interfaces/user-repository.ts'


class AccountNotFoundError extends Error {
  constructor(accountId: number) {
    super(`Account ${accountId} not found`);
    this.name = 'AccountNotFoundError';
  }
}

class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly userRepository: userRepository;
  
  constructor(accountRepository: AccountRepository , userRepository: userRepository) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async getBalance(accountId: number): Promise<number> {
    const amount = await this.accountRepository.getAmountById(accountId);
    if (amount === undefined) throw new AccountNotFoundError(accountId);

    return amount;
  }
  async getAccountName(accountId: number): Promise<string> {
    const name = await this.userRepository.getNameById(accountId);
    if (name === undefined) throw new AccountNotFoundError(accountId);

    return name.firstname + ' ' + name.lastname;
  }
}

export { AccountNotFoundError, AccountService };
