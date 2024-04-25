import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { USER_REPOSITORY } from '../../../constants';
import { ValidationException } from '../../../error/common.exception';
import { User } from '../../../user/entities/user.entity';
import { ConsumerUserService } from '../consumer-user.service';
import { UserErrors } from '../users.errors';
import { KidDto } from '../dto/kid.dto';

@Injectable()
export class KidsEmailsValidator implements CanActivate {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: typeof User
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        const parentUser = await this.userRepository.findOne({
            attributes: ['email'],
            where: { id: request.user.userId },
        });
        const inputKids = this.processInput(request.body, parentUser);
        this.validateInput(inputKids);
        this.identifyDuplicateInputKids(inputKids);
        await this.identifyDuplicateExistingKids(inputKids);
        return true;
    }

    private async identifyDuplicateExistingKids(inputKids: KidDto[]) {
        const inputUserEmails = inputKids.map((user) => user.email);
        const existingUserEmails = await this.userRepository.findAll<User>({
            attributes: ['email', 'id'],
            where: { email: inputUserEmails },
        });
        const existingUsersMap = new Map(
            existingUserEmails.map((user) => {
                return [user.email, user.id];
            })
        );
        const invalidUsers = inputKids
            .filter((user) => {
                return existingUsersMap.has(user.email) && (existingUsersMap.get(user.email) !== user.id || !user.id);
            })
            .map((user) => user.firstName + ' ' + user.lastName);
        if (invalidUsers.length > 0) {
            throw new ValidationException(UserErrors.usersExist(invalidUsers));
        }
    }

    private validateInput(inputKids) {
        inputKids.forEach((kid) => {
            if (!(kid.firstName && kid.lastName)) {
                throw new ValidationException(UserErrors.nameMissing());
            }
        });
    }

    private identifyDuplicateInputKids(inputKids) {
        const kidEmails = inputKids.map((kid) => kid.email);
        const duplicateKids = kidEmails.filter((item, index) => kidEmails.indexOf(item) != index);
        if (duplicateKids.length > 0) {
            throw new ValidationException(UserErrors.duplicatedKids());
        }
    }

    private processInput(inputKids: KidDto[], parentUser: User) {
        inputKids.forEach((kid) => {
            kid['email'] = ConsumerUserService.buildKidEmail(kid.firstName, kid.lastName, parentUser.email);
        });
        return inputKids;
    }
}
