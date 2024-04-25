import { Inject, Injectable } from '@nestjs/common';
import { CreateUserOptInDto } from './dto/create-opt-in.dto';
import { USER_OPTIN_REPOSITORY } from '../constants';
import { UserOptIn } from './entities/user-opt-in.entity';

@Injectable()
export class UserOptInService {
    constructor(@Inject(USER_OPTIN_REPOSITORY) private readonly repository: typeof UserOptIn) {}
    async create(createOptInDto: CreateUserOptInDto) {
        return await this.repository.create(createOptInDto);
    }

    async findOneById(id: string) {
        return await this.repository.findOne({ where: { userId: id } });
    }

    async upsert(optInDto: CreateUserOptInDto): Promise<any> {
        return await this.repository.upsert(optInDto);
    }
}
