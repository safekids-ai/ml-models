import { Statuses } from '../../status/default-status';
import { IsEnum } from 'class-validator';

export class OnboardStatusDto {
    @IsEnum(Statuses, { message: 'Only following statuses are allowed  [IN_PROGRESS,COMPLETED]' })
    readonly status: Statuses;
    readonly step: number;
}
