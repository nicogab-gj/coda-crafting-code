type UserData = {
  id: number,
  firstname: string,
  lastname: string,
  birthdate: string,
  countryOfResidence: string
}
abstract class UserRepository {
  // Resolves to undefined when the account does not exist
  abstract getUserData(accountId: number): Promise<UserData | null | undefined>
}

export {UserRepository}
export type { UserData }

