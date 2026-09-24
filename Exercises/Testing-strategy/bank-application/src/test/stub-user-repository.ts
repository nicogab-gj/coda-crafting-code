import { UserRepository } from '../interfaces/user-repository.ts';

class StubUserRepository extends UserRepository {
    private readonly nameById: Record<number, { firstname: string; lastname: string; }>;

    constructor(
        nameById: Record<number, { firstname: string; lastname: string; }> = {},
    ) {
        super();
        this.nameById = nameById;
    }

    async getNameById(userId: number): Promise<{ firstname: string; lastname: string; } | undefined> {
        return this.nameById[userId];
    }
}

export { StubUserRepository };