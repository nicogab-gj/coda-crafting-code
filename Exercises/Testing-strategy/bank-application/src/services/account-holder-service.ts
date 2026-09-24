import {AccountService} from './account-service.ts';
import {UserService} from './user-service.ts';
import {AccountInformationProvider, type AccountInformation} from '../interfaces/account-information-provider.ts';

class AccountHolderService extends AccountInformationProvider {
    private AccountService: AccountService;
    private UserService: UserService;

    constructor(AccountService: AccountService, UserService:UserService) {
        super();
        this.AccountService = AccountService;
        this.UserService = UserService;
    }

    async getAccountBalance(accountId: number): Promise<number> {
        return await this.AccountService.getBalance(accountId);
    }
    async getUserFirstName(accountId: number): Promise<string|undefined> {
        return await this.UserService.getUserFirstname(accountId);
    }
    async getUserLastName(accountId: number): Promise<string|undefined> {
        return await this.UserService.getUserLastname(accountId);
    }
    async getAccountInformation(accountId: number): Promise<AccountInformation> {
        return {
            balance: await this.getAccountBalance(accountId),
            firstname: await this.getUserFirstName(accountId),
            lastname: await this.getUserLastName(accountId),
        };
    }
}

export { AccountHolderService }

