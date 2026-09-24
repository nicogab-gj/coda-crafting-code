import { describe, expect, it } from 'vitest'
import { AccountService } from '../services/account-service.ts'
import { StubAccountRepository } from '../test/stub-account-repository.ts'
import { AccountController } from './account-controller.ts'
import type { Account } from '../types/account-type.ts'
import { StubUserRepository } from '../test/stub-user-repository.ts'
import type { User } from '../types/user-type.ts'


const accounts: Record<number, Account> = {
  123456789: { userId: 1, amount: 50 },
  1234567890: { userId: 1, amount: 50 },
};

const users: Record<number, User> = {
  1: { firstname:"Ethan", lastname: "Conan" },
  2: { firstname:"Matis", lastname: "Le" },
};

function createController(accounts: Record<number, Account>, users: Record<number, User> ): AccountController {
  return new AccountController(new AccountService(new StubAccountRepository(accounts), new StubUserRepository(users)))
}

describe('AccountController.getBalance', () => {
  it('accepts an id of 9 digits', async () => {
    const accountController = createController(accounts, users)

    expect(await accountController.getBalance('123456789')).toEqual({ statusCode: 200, body: { balance: 50 } })
  })

  it('rejects an id of 10 digits or more with 400', async () => {
    const accountController = createController(accounts, users)

    expect(await accountController.getBalance('1234567890')).toEqual({
      statusCode: 400,
      body: { error: 'Invalid account id' },
    })
  })
})
