import type {UserData, UserRepository} from '../interfaces/user-repository.ts';

class UserNotFoundError extends Error {
  constructor(accountId: number) {
    super(`Account ID with id: ${accountId} has no user`);
    this.name = 'UserNotFoundError';
  }
}

class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  private async getUser(accountId: number): Promise<UserData | null | undefined> {
    const userData: UserData | null | undefined = await this.userRepository.getUserData(accountId);

    if (!userData) throw new UserNotFoundError(accountId);

    return userData;
  }

  async getUserId(accountId: number): Promise<number | undefined> {
    return (await this.getUser(accountId))?.id;
  }

  async getUserFirstname(accountId: number): Promise<string|undefined> {
    return (await this.getUser(accountId))?.firstname;
  }

  async getUserLastname(accountId: number): Promise<string|undefined> {
    return (await this.getUser(accountId))?.lastname;
  }

  async getUserFullName(accountId: number): Promise<string|undefined> {
    return await this.getUserFirstname(accountId) + ' ' + await this.getUserLastname(accountId);
  }
}

export { UserNotFoundError, UserService };
