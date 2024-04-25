import { Inject, Injectable } from '@nestjs/common';
import { UserCode, UserCodeCreationAttributes } from './entities/user-code.entity';
import { USER_CODE_REPOSITORY } from '../../constants';
import { CodeType } from './code_type';

@Injectable()
export class UserCodeService {
    constructor(
        @Inject(USER_CODE_REPOSITORY)
        private readonly repository: typeof UserCode
    ) {}

    /**
     * Create user code
     * @param dto create user code request
     * @returns UserCode
     */
    async create(dto: UserCodeCreationAttributes): Promise<UserCode> {
        return await this.repository.create(dto);
    }

    /**
     * Find user code
     * @param userId user id
     * @param codeType
     * @returns UserCode
     */
    async findOne(userId: string, codeType: CodeType): Promise<UserCode> {
        return await this.repository.findOne<UserCode>({
            where: { userId, codeType },
        });
    }

    /**
     * Update user code
     * @param userId user id
     * @param codeType
     * @param code
     * @returns void
     */
    async update(userId: string, codeType: CodeType, code: string): Promise<void> {
        await this.repository.update({ code }, { where: { userId, codeType } });
    }

    /**
     * Delete user code
     * @param userId user id
     * @param codeType
     * @returns void
     */
    async deleteOne(userId: string, codeType: CodeType): Promise<void> {
        await this.repository.destroy({ where: { userId, codeType } });
    }
}
