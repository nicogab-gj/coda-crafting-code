// The port: what the application needs from account storage, whatever the storage is
export type Account = {
  balance: number;
  userId: number;
};
abstract class AccountRepository {
  // Resolves to undefined when the account does not exist
  abstract getAccountById(accountId: number): Promise<Account | undefined>;
}

export { AccountRepository };
