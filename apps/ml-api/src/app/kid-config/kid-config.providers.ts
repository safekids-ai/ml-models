import { KidConfig } from './entities/kid-config.entity';
import { KID_CONFIG_REPOSITORY } from '../constants';

export const kidConfigProviders = [
    {
        provide: KID_CONFIG_REPOSITORY,
        useValue: KidConfig,
    },
];
