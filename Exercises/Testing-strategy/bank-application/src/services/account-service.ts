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

  constructor(accountRepository: AccountRepository, userRepository: UserRepository ) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async getBalance(accountId: number): Promise<number> {
    const amount = await this.accountRepository.getAmountById(accountId);
    if (amount === undefined) throw new AccountNotFoundError(accountId);

    return amount;
  }

  async getUserId(accountId: number): Promise<number> {
    const user_id = await this.accountRepository.getUserIdById(accountId);
    if (user_id === undefined) throw new AccountNotFoundError(accountId);
    return user_id; 
  }

  async getFirstname(accountId: number): Promise<string> {
    const user_id = await this.getUserId(accountId)
    const firstname = await this.userRepository.getFirstNameById(user_id);
    if (firstname === undefined) throw new AccountNotFoundError(user_id);
    return firstname; 
  }


  async getLastname(accountId: number): Promise<string> {
    const user_id = await this.getUserId(accountId)
    const lastname = await this.userRepository.getLastNameById(user_id);
    if (lastname === undefined) throw new AccountNotFoundError(user_id);
    return lastname; 
  }
}

export { AccountNotFoundError, AccountService };
