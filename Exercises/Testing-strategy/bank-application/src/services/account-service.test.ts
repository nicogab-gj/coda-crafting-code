import { describe, expect, it } from 'vitest'
import { AccountNotFoundError, AccountService } from './account-service.ts'
import { StubAccountRepository } from '../test/stub-account-repository.ts'
import type { Account } from '../types/account-type.ts'
import type { User } from '../types/user-type.ts';
import { StubUserRepository } from '../test/stub-user-repository.ts';


const accounts: Record<number, Account> = {
  1: { userId: 1, amount: 1000 },
  2: { userId: 1, amount: 250.5 },
};

const users: Record<number, User> = {
  1: { firstname:"Ethan", lastname: "Conan" },
  2: { firstname:"Matis", lastname: "Le" },
};

const stub_account_repo = new StubAccountRepository(accounts)
const stub_users_repo = new StubUserRepository(users)

describe('AccountService.getBalance', () => {

  it('throws AccountNotFoundError when the account does not exist', async () => {
    const accountService = new AccountService(stub_account_repo,stub_users_repo)
    await expect(accountService.getBalance(999)).rejects.toThrow(AccountNotFoundError)
  })

  it('Get balance by account ID', async () => {
    const accountService = new AccountService(stub_account_repo,stub_users_repo)
    const balance = await accountService.getBalance(1)
    expect(balance).toBe(1000)
  })

  it('Get user_id by account ID', async () => {
    const accountService = new AccountService(stub_account_repo,stub_users_repo)
    const user_id = await accountService.getUserId(1)
    expect(user_id).toBe(1)
  })

  it('Get firstname by account ID', async () => {
    const accountService = new AccountService(stub_account_repo,stub_users_repo)
    const user_id = await accountService.getFirstname(1)
    expect(user_id).toBe("Ethan")
  })

  it('Get lastname by account ID', async () => {
    const accountService = new AccountService(stub_account_repo,stub_users_repo)
    const user_id = await accountService.getLastname(1)
    expect(user_id).toBe("Conan")
  })

})
