import { INTERNAL_API_KEY } from '../constants';
import { InternalApiKey } from './entities/internal-api-key.entity';

export const internalApiKeyProviders = [
    {
        provide: INTERNAL_API_KEY,
        useValue: InternalApiKey,
    },
];
