import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { USER_REPOSITORY } from '../../../constants';
import { ValidationException } from '../../../error/common.exception';
import { UserErrors } from '../../user/users.errors';
import { User } from '../../../user/entities/user.entity';
import { LoggingService } from '../../../logger/logging.service';

@Injectable()
export class UserYearValidator implements CanActivate {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: typeof User,
        private readonly log: LoggingService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        const invalidUsers = request.body.filter((user) => !(user.yearOfBirth && user.yearOfBirth.length === 4)).map((user) => user.email);

        if (invalidUsers.length > 0) {
            throw new ValidationException(UserErrors.invalidYear(invalidUsers));
        }
        return true;
    }
}
