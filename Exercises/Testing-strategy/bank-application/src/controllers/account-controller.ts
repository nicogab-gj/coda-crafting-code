import type { AccountInformationProvider } from '../interfaces/account-information-provider.ts'
import { AccountNotFoundError } from '../services/account-service.ts'
import type { HttpResponse } from '../http.ts'

// Longer ids would lose precision once turned into a number, or overflow the database bigint
const MAX_ACCOUNT_ID_LENGTH = 9

class AccountController {
  private readonly accountInformationProvider: AccountInformationProvider

  constructor(accountInformationProvider: AccountInformationProvider) {
    this.accountInformationProvider = accountInformationProvider
  }

  // GET /accounts/:id/balance
  async getBalance(accountId: string): Promise<HttpResponse> {
    if (accountId.length > MAX_ACCOUNT_ID_LENGTH) {
      return { statusCode: 400, body: { error: 'Invalid account id' } }
    }

    try {
      const accountInformation = await this.accountInformationProvider.getAccountInformation(Number(accountId))

      return { statusCode: 200, body: accountInformation }
    } catch (error) {
      if (!(error instanceof AccountNotFoundError)) throw error

      return { statusCode: 404, body: { error: 'Account not found' } }
    }
  }
}

export { AccountController }
