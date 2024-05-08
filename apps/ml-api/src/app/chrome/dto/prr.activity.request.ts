import { PrrActivityDto } from './prr.activity.dto';
import { UserTokenDTO } from '../../auth/auth.dto';

export class PrrActivityRequest {
    type: string;
    activities: PrrActivityDto[];
    token: UserTokenDTO;
}
