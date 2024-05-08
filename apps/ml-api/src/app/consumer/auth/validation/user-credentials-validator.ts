import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { USER_REPOSITORY } from '../../../constants';
import { ValidationException } from '../../../error/common.exception';
import { UserErrors } from '../../user/users.errors';
import { User } from '../../../user/entities/user.entity';
import { LoggingService } from '../../../logger/logging.service';
import { PasswordUtil } from '../../../utils/password.util';

@Injectable()
export class UserCredentialsValidator implements CanActivate {
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
        if (!request.body.email) {
            throw new ValidationException('email must be provided');
        }
        if (!request.body.password) {
            throw new ValidationException('password must be provided');
        }
        const user = await this.userRepository.findOne<User>({
            attributes: ['email', 'password'],
            where: { email: request.body.email },
        });
        if (user && (await PasswordUtil.verify(request.body.password, user?.password))) {
            return true;
        }
        throw new UnauthorizedException(UserErrors.invalidCredentials());
    }
}
