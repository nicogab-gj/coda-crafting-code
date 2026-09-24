import { UserRepository, type User } from '../interfaces/user-repository';

export class StubUserRepository extends UserRepository {
  usersById: Record<number, User>;
  constructor(usersById: Record<number, User>) {
    super();
    this.usersById = usersById;
  }

  async getNamesById(userId: number): Promise<User | undefined> {
    return this.usersById[userId];
  }
}
