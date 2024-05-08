import { ParentConsent } from './entities/parent-consent.entity';
import { PARENT_CONSENT_REPOSITORY } from '../../constants';

export const parentConsentProviders = [
    {
        provide: PARENT_CONSENT_REPOSITORY,
        useValue: ParentConsent,
    },
];
