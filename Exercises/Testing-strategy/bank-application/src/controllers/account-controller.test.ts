import { describe, expect, it } from 'vitest'
import type { AccountInformation } from '../interfaces/account-information-provider.ts'
import { StubAccountInformationProvider } from '../test/stub-account-information-provider.ts'
import { AccountController } from './account-controller.ts'

const ADA: AccountInformation = { balance: 50, firstname: 'Ada', lastname: 'Lovelace' }

function createController(informationById: Record<number, AccountInformation>): AccountController {
  return new AccountController(new StubAccountInformationProvider(informationById))
}

describe('AccountController.getBalance', () => {
  it('accepts an id of 9 digits', async () => {
    const accountController = createController({ 123456789: ADA })

    expect(await accountController.getBalance('123456789')).toEqual({ statusCode: 200, body: ADA })
  })

  it('rejects an id of 10 digits or more with 400', async () => {
    const accountController = createController({ 1234567890: ADA })

    expect(await accountController.getBalance('1234567890')).toEqual({
      statusCode: 400,
      body: { error: 'Invalid account id' },
    })
  })

  it('responds with 404 when the account does not exist', async () => {
    const accountController = createController({})

    expect(await accountController.getBalance('999')).toEqual({
      statusCode: 404,
      body: { error: 'Account not found' },
    })
  })
})
