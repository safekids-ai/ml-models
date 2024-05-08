import { PrrAction } from './entities/prr-action.entity';
import { PRRACTION_REPOSITORY } from '../constants';

export const prrActionProviders = [
    {
        provide: PRRACTION_REPOSITORY,
        useValue: PrrAction,
    },
];
