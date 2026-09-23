import { describe, expect, it } from 'vitest'
import { AccountNotFoundError, AccountService } from './account-service.ts'
import { StubAccountRepository } from '../test/stub-account-repository.ts'

describe('AccountService.getBalance', () => {
  it('returns the amount of the account', async () => {
    const accountService = new AccountService(new StubAccountRepository({ 1: 1000, 2: 250.5 }))

    expect(await accountService.getBalance(2)).toBe(250.5)
  })

  it('throws AccountNotFoundError when the account does not exist', async () => {
    const accountService = new AccountService(new StubAccountRepository())

    await expect(accountService.getBalance(999)).rejects.toThrow(AccountNotFoundError)
  })
})
