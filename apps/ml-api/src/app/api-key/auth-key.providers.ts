import { SERVICES_APIKEY_REPOSITORY } from '../constants';
import { ServicesApiKey } from './entities/api-key.entity';

export const apiKeyProviders = [
    {
        provide: SERVICES_APIKEY_REPOSITORY,
        useValue: ServicesApiKey,
    },
];
