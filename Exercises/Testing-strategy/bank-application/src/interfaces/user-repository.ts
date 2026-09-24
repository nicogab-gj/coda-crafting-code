abstract class UserRepository {

  abstract getNameById(userId: number): Promise<{ firstname: string; lastname: string } | undefined>
  
}
export { UserRepository }