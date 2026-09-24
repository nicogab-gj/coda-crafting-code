import { AccountRepository } from '../interfaces/account-repository.ts';
import type { Account } from '../types/account-type.ts';

// In-memory AccountRepository for unit tests: answers from the amounts it is given,
// so tests run without a database


class StubAccountRepository extends AccountRepository {

  private readonly accountById: ReadonlyMap<number, Account>;

  constructor(accountById: Record<number, Account> = {}, ) {
    super();
    this.accountById = new Map(Object.entries(accountById).map(([id, account]) => [Number(id), account]));
  }

  async getAmountById(accountId: number): Promise<number | undefined> {
    return this.accountById.get(accountId)?.amount;
  }

  async getUserIdById(accountId: number): Promise<number | undefined> {
    return this.accountById.get(accountId)?.userId;
  }

}

export { StubAccountRepository };
