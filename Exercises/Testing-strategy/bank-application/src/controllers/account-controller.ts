import { AccountNotFoundError, type AccountService } from '../services/account-service.ts';
import type { HttpResponse } from '../http.ts';

type AccountInfo = { balance: number; firstName: string; lastName: string };

// Longer ids would lose precision once turned into a number, or overflow the database bigint
const MAX_ACCOUNT_ID_LENGTH = 9;

class AccountController {
  private readonly accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  // GET /accounts/:id/balance
  async getBalance(accountId: string): Promise<HttpResponse> {
    if (accountId.length > MAX_ACCOUNT_ID_LENGTH) {
      return { statusCode: 400, body: { error: 'Invalid account id' } };
    }

    try {
      const accountInfo: AccountInfo = await this.accountService.getAccountInfo(Number(accountId));

      return { statusCode: 200, body: accountInfo };
    } catch (error) {
      if (!(error instanceof AccountNotFoundError)) throw error;

      return { statusCode: 404, body: { error: 'Account not found' } };
    }
  }
}

export { AccountController };
