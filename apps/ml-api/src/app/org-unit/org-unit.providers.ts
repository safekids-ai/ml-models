import { ORG_UNIT_REPOSITORY } from '../constants';
import { OrgUnit } from './entities/org-unit.entity';

export const orgUnitProviders = [
    {
        provide: ORG_UNIT_REPOSITORY,
        useValue: OrgUnit,
    },
];
