
import type { UserRepository } from '../interfaces/user-repository.ts';

class UserNotFoundError extends Error {
  constructor(usreId: number) {
    super(`User ${usreId} not found`);
    this.name = 'UserNotFoundError';
  }
}

class UserService {
  private readonly userRepository: UserRepository;

  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  
  async getFirstName(userId: number): Promise<string> {
    const firstname = await this.userRepository.getFirstNameById(userId);
    if (firstname === undefined) throw new UserNotFoundError(userId);
    return firstname;
  }

  /*
  async getUserId(accountId: number): Promise<number> {
    const user_id = await this.accountRepository.getUserIdById(accountId);
    if (user_id === undefined) throw new AccountNotFoundError(accountId);
    return user_id; 
  }

  */
  
}

export { UserNotFoundError, UserService };
