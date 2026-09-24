import { describe, expect, it } from 'vitest'
import type { User } from '../types/user-type.ts';
import { UserNotFoundError, UserService } from './user-service.ts';
import { StubUserRepository } from '../test/stub-user-repository.ts';


const users: Record<number, User> = {
  1: { firstname:"Ethan", lastname: "Conan" },
  2: { firstname:"Matis", lastname: "Le" },
};

describe('UserService', () => {

  it('throws UserNotFoundError when the user does not exist', async () => {
    const userService = new UserService (new StubUserRepository(users))

    await expect(userService.getFirstName(999)).rejects.toThrow(UserNotFoundError)
  })


  /*

  it('Get balance by account ID', async () => {
    const accountService = new AccountService(new StubAccountRepository(accounts))
    const balance = await accountService.getBalance(1)
    expect(balance).toBe(1000)
  })

  it('Get user_id by account ID', async () => {
    const accountService = new AccountService(new StubAccountRepository(accounts))
    const user_id = await accountService.getUserId(1)
    expect(user_id).toBe(1)
  })

  it('Get user_name by account ID', async () => {
    const accountService = new AccountService(new StubAccountRepository(accounts))
    const user_id = await accountService.getUserId(2)
    expect(user_id).toBe(1)
  })
  
  */

})
