import { PRRTRIGGER_REPOSITORY } from '../constants';
import { PrrTrigger } from './entities/prr-trigger.entity';

export const prrTriggerProviders = [
    {
        provide: PRRTRIGGER_REPOSITORY,
        useValue: PrrTrigger,
    },
];
