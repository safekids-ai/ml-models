import { PLAN_REPOSITORY } from '../../constants';
import { Plan } from './entities/plan.entity';

export const planProviders = [
    {
        provide: PLAN_REPOSITORY,
        useValue: Plan,
    },
];
