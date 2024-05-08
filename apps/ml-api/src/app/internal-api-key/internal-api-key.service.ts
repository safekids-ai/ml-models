import { Inject, Injectable } from '@nestjs/common';
import { INTERNAL_API_KEY } from '../constants';
import { InternalApiKey, InternalApiKeyCreationAttributes } from './entities/internal-api-key.entity';

@Injectable()
export class InternalApiKeyService {
    constructor(@Inject(INTERNAL_API_KEY) private readonly repository: typeof InternalApiKey) {}
    create(createInternalApiKeyDto: InternalApiKeyCreationAttributes) {
        return this.repository.create(createInternalApiKeyDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    async findOne(key: string) {
        return await this.repository.findOne({ where: { key } });
    }
}
