import { describe, expect, it } from 'vitest'
import { AccountService } from '../services/account-service.ts'
import { StubAccountRepository } from '../test/stub-account-repository.ts'
import { AccountController } from './account-controller.ts'

function createController(amountsById: Record<number, number>): AccountController {
  return new AccountController(new AccountService(new StubAccountRepository(amountsById)))
}

describe('AccountController.getBalance', () => {
  it('accepts an id of 9 digits', async () => {
    const accountController = createController({ 123456789: 50 })

    expect(await accountController.getBalance('123456789')).toEqual({ statusCode: 200, body: { balance: 50 } })
  })

  it('rejects an id of 10 digits or more with 400', async () => {
    const accountController = createController({ 1234567890: 50 })

    expect(await accountController.getBalance('1234567890')).toEqual({
      statusCode: 400,
      body: { error: 'Invalid account id' },
    })
  })
})
