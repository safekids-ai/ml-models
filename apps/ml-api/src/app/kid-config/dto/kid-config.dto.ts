import { Statuses } from '../../status/default-status';
import { ExtensionStatus } from '../enum/extension-status';

export class KidConfigDTO {
    id: string;
    offTime: string;
    userId: string;
    status: Statuses;
    step: number;
    extensionStatus: ExtensionStatus;
    extensionStatusUpdatedAt: Date;
    accessLimitedAt: Date;
    planType?: string;
}
