import { AccountRepository } from '../interfaces/account-repository.ts';

// In-memory AccountRepository for unit tests: answers from the amounts it is given,
// so tests run without a database
class StubAccountRepository extends AccountRepository {
  private readonly amountsById: ReadonlyMap<number, number>;
  private readonly userIdsById: Record<number, number>;

  constructor(
    amountsById: Record<number, number> = {},
    userIdsById: Record<number, number> = {},
  ) {
    super();
    this.amountsById = new Map(Object.entries(amountsById).map(([id, amount]) => [Number(id), amount]));
    this.userIdsById = userIdsById;
  }

  async getAmountById(accountId: number): Promise<number | undefined> {
    return this.amountsById.get(accountId);
  }

 async getUserIdById(accountId: number): Promise<number | undefined> {
    return this.userIdsById[accountId];
  }
}

export { StubAccountRepository };
