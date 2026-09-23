// The port: what the application needs from account storage, whatever the storage is
abstract class AccountRepository {
  // Resolves to undefined when the account does not exist
  abstract getAmountById(accountId: number): Promise<number | undefined>
}

export { AccountRepository }
