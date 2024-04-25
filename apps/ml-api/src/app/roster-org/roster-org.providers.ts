import { ROSTER_ORG_REPOSITORY } from '../constants';
import { RosterOrg } from './entities/roster-org.entity';

export const rosterOrgProviders = [
    {
        provide: ROSTER_ORG_REPOSITORY,
        useValue: RosterOrg,
    },
];
