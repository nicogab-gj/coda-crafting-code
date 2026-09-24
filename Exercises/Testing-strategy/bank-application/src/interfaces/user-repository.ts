// The port: what the application needs from account storage, whatever the storage is
abstract class UserRepository {
  
  abstract getFirstNameById(UserId: number): Promise<string | undefined>
  abstract getLastNameById(UserId: number): Promise<string | undefined>

}

export { UserRepository }
