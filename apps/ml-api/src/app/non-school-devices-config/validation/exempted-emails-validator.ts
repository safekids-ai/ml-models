import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationException } from '../../error/common.exception';
import { USER_REPOSITORY } from '../../constants';
import { User } from '../../user/entities/user.entity';
import { UserRoles } from '../../user/user.roles';
import { NonSchoolDevicesConfigErrors } from '../non-school-devices-config-errors';

@Injectable()
export class ExemptedEmailsValidator implements CanActivate {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: typeof User
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        ExemptedEmailsValidator.validateInput(request);
        const dbUsers = await this.userRepository.findAll<User>({
            attributes: ['role', 'isAdmin', 'email'],
            where: { accountId: request.user.accountId },
        });
        const dbUserEmails = dbUsers.filter((user) => user.role === UserRoles.STUDENT && !user.isAdmin).map((user) => user.email);
        const invalidEmails = request.body.emails.filter((email) => !dbUserEmails.includes(email));
        if (invalidEmails.length > 0) {
            throw new ValidationException(NonSchoolDevicesConfigErrors.invalidEmails(invalidEmails));
        }
        return true;
    }

    private static validateInput(request) {
        if (!request.body.emails) {
            throw new ValidationException('emails must be provided');
        }
        if (!Array.isArray(request.body.emails)) {
            throw new ValidationException('emails must be an array');
        }
        if (request.body.emails.length < 1) {
            throw new ValidationException('emails must contain at least 1 element.');
        }
        const duplicates = ExemptedEmailsValidator.findDuplicates(request.body.emails);
        if (duplicates.length > 0) {
            throw new ValidationException('emails must be unique.');
        }
    }

    private static findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
}
