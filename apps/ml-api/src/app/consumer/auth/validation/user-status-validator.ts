import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {
  ACCOUNT_REPOSITORY,
  FILTEREDCATEGORY_REPOSITORY,
  FILTEREDURL_REPOSITORY,
  ORG_UNIT_REPOSITORY,
  USER_CODE_REPOSITORY,
  USER_REPOSITORY,
} from '../../../constants';
import {ValidationException} from '../../../error/common.exception';
import {Statuses} from '../../../status/default-status';
import {UserErrors} from '../../user/users.errors';
import {User} from '../../../user/entities/user.entity';
import {LoggingService} from '../../../logger/logging.service';
import {Account} from '../../../accounts/entities/account.entity';
import {OrgUnit} from '../../../org-unit/entities/org-unit.entity';
import {UserCode} from '../../user-code/entities/user-code.entity';
import {FilteredUrl} from '../../../filtered-url/entities/filtered-url.entity';
import {FilteredCategory} from '../../../filtered-category/entities/filtered-category.entity';

@Injectable()
export class UserStatusValidator implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: typeof Account,
    @Inject(ORG_UNIT_REPOSITORY)
    private readonly orgUnitRepository: typeof OrgUnit,
    @Inject(USER_CODE_REPOSITORY)
    private readonly userCodeRepository: typeof UserCode,
    @Inject(FILTEREDURL_REPOSITORY)
    private readonly filteredUrlRepository: typeof FilteredUrl,
    @Inject(FILTEREDCATEGORY_REPOSITORY)
    private readonly filteredCategoryRepository: typeof FilteredCategory,
    private readonly log: LoggingService
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request): Promise<boolean> {
    if (!request.body) {
      const cleanObject = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params
      };
      throw new Error("No JSON body was provided in the request" + JSON.stringify(cleanObject));
    }
    if (!request.body.email) {
      throw new ValidationException('email must be provided');
    }
    const user = await this.userRepository.findOne<User>({
      attributes: ['id', 'statusId'],
      where: {email: request.body.email},
    });
    if (user) {
      if (user.statusId === Statuses.ACTIVE) {
        throw new ValidationException(UserErrors.emailExists(request.body.email));
      } else {
        //should delete or suggest for forgot password..
        this.log.debug('Deleting inactive user...', user);
        await this.userCodeRepository.destroy({where: {userId: user.id}, force: true});
        await this.userRepository.destroy({where: {email: request.body.email}, force: true});
        const account = await this.accountRepository.findOne({where: {primaryDomain: request.body.email}});
        await this.filteredUrlRepository.destroy({where: {accountId: account.id}, force: true});
        await this.filteredCategoryRepository.destroy({where: {accountId: account.id}, force: true});
        await this.orgUnitRepository.destroy({where: {accountId: account.id}, force: true});
        await this.accountRepository.destroy({where: {primaryDomain: request.body.email}, force: true});
        return true;
      }
    }
    return true;
  }
}
