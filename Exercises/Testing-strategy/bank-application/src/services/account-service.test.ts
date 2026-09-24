import { describe, expect, it } from 'vitest'
import { AccountNotFoundError, AccountService } from './account-service.ts'
import { StubAccountRepository } from '../test/stub-account-repository.ts'
import { StubUserRepository } from '../test/stub-user-repository.ts'

describe('AccountService.getBalance', () => {
  it('returns the amount of the account', async () => {
    const accountService = new AccountService(new StubAccountRepository({ 1: 1000, 2: 250.5 }), new StubUserRepository())
    expect(await accountService.getBalance(2)).toBe(250.5)
  })

  it('throws AccountNotFoundError when the account does not exist', async () => {
    const accountService = new AccountService(new StubAccountRepository(), new StubUserRepository())

    await expect(accountService.getBalance(999)).rejects.toThrow(AccountNotFoundError)
  })
 
})

describe('AccountService.getAccountName', () => {
  it('returns the name of the account', async () => {
    const accountService = new AccountService(new StubAccountRepository(), new StubUserRepository({ 1: { firstname: 'John', lastname: 'Doe' } }))

    expect(await accountService.getAccountName(1)).toBe('John Doe')
  })
  it('throws AccountNotFoundError when the account does not exist', async () => {
    const accountService = new AccountService(new StubAccountRepository(), new StubUserRepository())
    await expect(accountService.getAccountName(999)).rejects.toThrow(AccountNotFoundError)
  })
})
