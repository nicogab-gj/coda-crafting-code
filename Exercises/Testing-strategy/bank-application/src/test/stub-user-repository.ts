import { UserRepository } from '../interfaces/user-repository.ts';
import type { User } from '../types/user-type.ts';


class StubUserRepository extends UserRepository {
  private readonly users: ReadonlyMap<number, User>;

  constructor(userById: Record<number, User> = {}, ) {
    super();
    this.users = new Map(Object.entries(userById).map(([id, user]) => [Number(id), user]));
  }

  async getFirstNameById(userId: number): Promise<string | undefined> {
    return this.users.get(userId)?.firstname;
  }

  async getLastNameById(userId: number): Promise<string | undefined> {
    return this.users.get(userId)?.lastname;
  }
}

export { StubUserRepository };
