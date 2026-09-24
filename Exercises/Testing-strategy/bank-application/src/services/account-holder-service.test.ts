import { describe, expect, it } from 'vitest';
import { AccountHolderService } from './account-holder-service';
import {AccountService} from "./account-service.ts";
import {StubAccountRepository} from "../test/stub-account-repository.ts";
import {UserService} from "./user-service.ts";
import {StubUserRepository} from "../test/stub-user-repository.ts";
import type {UserData} from "../interfaces/user-repository.ts";

describe('Test AccountHolderService display balance, firstname et lastname in endpoint', () => {
    it('should return the balance of the account', async () => {
        const stubAccountService = new AccountService(new StubAccountRepository({ 2: 250.5 }));
        const stubUserService = new UserService(new StubUserRepository(new Map([[999, null]])));

        const accountHolderService = new AccountHolderService(stubAccountService, stubUserService);

        expect(await accountHolderService.getAccountBalance(2)).toBe(250.5);
    })

    it("should return balance and fullname of the user's account", async () => {
        const user: UserData = {
            id: 2,
            firstname: 'john',
            lastname: 'doe',
            birthdate: '1990-01-01',
            countryOfResidence: 'FR',
        }

        const stubAccountService = new AccountService(new StubAccountRepository({ 3: 1000 }));
        const stubUserService = new UserService(new StubUserRepository(new Map([[3, user]])));

        const accountHolderService = new AccountHolderService(stubAccountService, stubUserService);

        expect(await accountHolderService.getAccountInformation(3)).toStrictEqual({balance:1000, firstname:"john", lastname:"doe"});
    })
})

