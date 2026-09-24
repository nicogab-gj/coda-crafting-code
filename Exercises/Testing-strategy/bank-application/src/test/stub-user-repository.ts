import {userRepository} from '../interfaces/user-repository.ts'

class StubUserRepository extends userRepository {
    private readonly namesById: ReadonlyMap<number, {firstname:string, lastname:string}>;
    constructor(namesById: Record<number, {firstname:string, lastname:string}> = {}) {
        super();
        this.namesById = new Map(Object.entries(namesById).map(([id, name]) => [Number(id), name]));
    }
    async getNameById(accountId: number): Promise<{firstname:string, lastname:string} | undefined> {
        return this.namesById.get(accountId);
    }
}

export { StubUserRepository };