import { Inject, Injectable } from '@nestjs/common';
import { INTERCEPTIONTIME_REPOSITORY } from '../constants';
import { InterceptionTime, InterceptionTimeCreationAttributes } from './entities/interception-time.entity';

@Injectable()
export class InterceptionTimeService {
    constructor(@Inject(INTERCEPTIONTIME_REPOSITORY) private readonly interceptionTimeRepository: typeof InterceptionTime) {}
    create(createInterceptionTimeDto: InterceptionTimeCreationAttributes) {
        return this.interceptionTimeRepository.create(createInterceptionTimeDto);
    }

    async findAll(accountId: string): Promise<InterceptionTime[]> {
        return await this.interceptionTimeRepository.findAll({ where: { accountId } });
    }

    async findOne(id: string): Promise<InterceptionTime> {
        return await this.interceptionTimeRepository.findOne({ where: { id: id } });
    }

    async findOneByAccountId(accountId: string): Promise<InterceptionTime> {
        return await this.interceptionTimeRepository.findOne({ where: { accountId } });
    }

    async update(id: string, updateInterceptionTimeDto: Partial<InterceptionTimeCreationAttributes>) {
        return await this.interceptionTimeRepository.update(updateInterceptionTimeDto, { where: { id: id } });
    }

    async remove(id: string) {
        return await this.interceptionTimeRepository.destroy({ where: { id: id } });
    }

    async upsert(createInterceptionTimeDto: InterceptionTimeCreationAttributes) {
        return await this.interceptionTimeRepository.upsert(createInterceptionTimeDto);
    }

    async findByAccountId(accountId) {
        const result = await this.interceptionTimeRepository.findOne({ where: { accountId, statusId: 'ACTIVE' } });
        return result;
    }
}
