import { KidRequest } from './kid-request.entity';
import { KID_REQUEST_REPOSITORY } from '../../constants';

export const KidRequestProvider = [
    {
        provide: KID_REQUEST_REPOSITORY,
        useValue: KidRequest,
    },
];
