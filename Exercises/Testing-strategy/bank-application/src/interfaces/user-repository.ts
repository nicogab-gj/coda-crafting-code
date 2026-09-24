abstract class userRepository {
    abstract getNameById(accountId: number): Promise<{firstname:string, lastname:string} | undefined>
    
}
export {userRepository}