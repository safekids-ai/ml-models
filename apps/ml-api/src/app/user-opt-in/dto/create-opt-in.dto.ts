import { UserOptInAttributes } from '../entities/user-opt-in.entity';

export class CreateUserOptInDto implements UserOptInAttributes {
    emailOptInSelection?: boolean;
    emailOptInTime?: Date;
    onboardingDone?: boolean;
    onboardingTime?: Date;
    userId?: string;
}
