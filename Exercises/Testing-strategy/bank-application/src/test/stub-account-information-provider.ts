import { AccountInformationProvider, type AccountInformation } from '../interfaces/account-information-provider.ts'
import { AccountNotFoundError } from '../services/account-service.ts'

// In-memory AccountInformationProvider for unit tests: answers from the information it is given,
// so controller tests do not depend on any service implementation
class StubAccountInformationProvider extends AccountInformationProvider {
  private readonly informationById: ReadonlyMap<number, AccountInformation>

  constructor(informationById: Record<number, AccountInformation> = {}) {
    super()
    this.informationById = new Map(Object.entries(informationById).map(([id, information]) => [Number(id), information]))
  }

  async getAccountInformation(accountId: number): Promise<AccountInformation> {
    const information = this.informationById.get(accountId)
    if (information === undefined) throw new AccountNotFoundError(accountId)

    return information
  }
}

export { StubAccountInformationProvider }
