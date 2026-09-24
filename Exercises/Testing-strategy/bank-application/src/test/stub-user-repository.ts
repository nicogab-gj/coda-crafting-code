import { UserRepository } from '../interfaces/user-repository.ts';
import type { UserData } from '../interfaces/user-repository.ts';

class StubUserRepository extends UserRepository {
  private readonly userByAccountId: Map<number, UserData | null>;

  constructor(userByAccountId: Map<number, UserData|null>) {
    super();
    this.userByAccountId = userByAccountId;
  }

  async getUserData(accountId: number): Promise<UserData | null | undefined> {

    return this.userByAccountId.get(accountId);
  }

}

export { StubUserRepository };
