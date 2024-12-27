import { Inject, Injectable } from '@nestjs/common';
import { SERVICES_APIKEY_REPOSITORY } from '../constants';
import { ServicesApiKey, ServicesApiKeyCreationAttributes } from './entities/api-key.entity';
import { CryptoUtil } from '../utils/crypto.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {
    constructor(
        @Inject(SERVICES_APIKEY_REPOSITORY)
        private readonly servicesApiKeyRepository: typeof ServicesApiKey
    ) {}
    async create(createApiKeyDto: ServicesApiKeyCreationAttributes) {
        try {
            createApiKeyDto.id = uuidv4();
            // if (createApiKeyDto.accessKey) {
            //   createApiKeyDto.accessKey = await CryptoUtil.encrypt(
            //     createApiKeyDto.accessKey
            //   );
            // }
            // if (createApiKeyDto.secret) {
            //   createApiKeyDto.secret = await CryptoUtil.encrypt(
            //     createApiKeyDto.secret
            //   );
            // }
            return this.servicesApiKeyRepository.create(createApiKeyDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    findAll(accountId: string) {
        return this.servicesApiKeyRepository.findAll({ where: { accountId } });
    }

    findOne(id: string) {
        return this.servicesApiKeyRepository.findOne({ where: { id } });
    }

    async findOneByAccount(accountId: string) {
        const apiKey: ServicesApiKey = await this.servicesApiKeyRepository.findOne({
            where: { accountId },
        });
        // if (apiKey && apiKey.accessKey) {
        //   apiKey.accessKey = await CryptoUtil.decrypt(apiKey.accessKey);
        // }
        // if (apiKey && apiKey.secret) {
        //   apiKey.secret = await CryptoUtil.decrypt(apiKey.secret);
        // }
        return apiKey;
    }

    async findOneByService(service: string, decrypt: string): Promise<ServicesApiKey> {
        const apiKey: ServicesApiKey = await this.servicesApiKeyRepository.findOne({
            where: { service },
        });
        if (!!decrypt && decrypt === 'true') {
            if (apiKey.accessKey) {
                apiKey.accessKey = await CryptoUtil.decrypt(apiKey.accessKey);
            }
            if (apiKey.secret) {
                apiKey.secret = await CryptoUtil.decrypt(apiKey.secret);
            }
        }
        return apiKey;
    }

    async update(id: string, updateApiKeyDto: Partial<ServicesApiKeyCreationAttributes>) {
        try {
            // if (updateApiKeyDto.accessKey) {
            //   updateApiKeyDto.accessKey = await CryptoUtil.encrypt(
            //     updateApiKeyDto.accessKey
            //   );
            // }
            // if (updateApiKeyDto.secret) {
            //   updateApiKeyDto.secret = await CryptoUtil.encrypt(
            //     updateApiKeyDto.secret
            //   );
            // }
        } catch (error) {
            throw new Error(error);
        }
        return this.servicesApiKeyRepository.update(updateApiKeyDto, {
            where: { id },
        });
    }

    remove(id: string) {
        return this.servicesApiKeyRepository.destroy({ where: { id } });
    }

    /**
     * Get All API Keys for given service
     * @param service name of the service e.g. ONEROSTER
     * @returns list of services
     */
    findAllByService(service: string): Promise<ServicesApiKey[]> {
        return this.servicesApiKeyRepository.findAll({ where: { service } });
    }
}
