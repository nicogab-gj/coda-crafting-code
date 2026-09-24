import { describe, expect, it } from 'vitest'
import { UserNotFoundError, UserService } from './user-service.ts'
import { StubUserRepository } from '../test/stub-user-repository.ts'
import type { UserData } from "../interfaces/user-repository.ts"

describe('User service get user from account', () => {
    it("throws UserNotFoundError when the user's does not exist", async () => {
        const userService = new UserService(new StubUserRepository(new Map([[999, null]])));

        await expect(userService.getUserId(999)).rejects.toThrow(UserNotFoundError)
    })

    it("returns the id of the account's user", async () => {
        const user: UserData = {
            id: 2,
            firstname: 'john',
            lastname: 'doe',
            birthdate: '1990-01-01',
            countryOfResidence: 'FR',
        }
        const userService = new UserService(new StubUserRepository(new Map([[3, user]])));

        expect(await userService.getUserId(3)).toBe(2)
    })

    it("returns the firstname and the lastname of the user", async () => {
        const user: UserData = {
            id: 2,
            firstname: 'john',
            lastname: 'doe',
            birthdate: '1990-01-01',
            countryOfResidence: 'FR',
        }
        const userService = new UserService(new StubUserRepository(new Map([[3, user]])));

        expect(await userService.getUserFullName(3)).toBe("john doe")
    })

})
