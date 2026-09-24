type AccountInformation = {
  balance: number
  firstname: string | undefined
  lastname: string | undefined
}

// The port: what the account controller needs, whatever service answers it
abstract class AccountInformationProvider {
  // Rejects with AccountNotFoundError when the account does not exist
  abstract getAccountInformation(accountId: number): Promise<AccountInformation>
}

export { AccountInformationProvider }
export type { AccountInformation }
