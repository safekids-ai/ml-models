import { INFORM_PRR_VISIT_REPOSITORY } from '../constants';
import { InformPrrVisit } from './entities/inform-prr-visit.entity';

export const informPrrVisitProviders = [
    {
        provide: INFORM_PRR_VISIT_REPOSITORY,
        useValue: InformPrrVisit,
    },
];
