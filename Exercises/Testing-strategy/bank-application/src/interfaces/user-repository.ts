type User = {
  firstName: string;
  lastName: string;
};
abstract class UserRepository {
  abstract getNamesById(userId: number): Promise<User | undefined>;
}

export { UserRepository };

export type { User };
