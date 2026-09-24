import { AccountRepository, type Account } from '../interfaces/account-repository.ts';

// In-memory AccountRepository for unit tests: answers from the amounts it is given,
// so tests run without a database

class StubAccountRepository extends AccountRepository {
  private readonly accountsById: ReadonlyMap<number, Account>;

  constructor(amountsById: Record<number, Account> = {}) {
    super();
    this.accountsById = new Map(Object.entries(amountsById).map(([id, amount]) => [Number(id), amount]));
  }

  async getAccountById(accountId: number): Promise<Account | undefined> {
    return this.accountsById.get(accountId);
  }
}

export { StubAccountRepository };
