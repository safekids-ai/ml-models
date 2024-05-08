import {Inject, Injectable} from '@nestjs/common';
import {LoggingService} from '../../logger/logging.service';
import {JwtTokenService} from '../../auth/jwtToken/jwt.token.service';
import {ConsumerUserService} from '../user/consumer-user.service';
import {UserDto} from '../user/dto/user.dto';
import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE, SUBSCRIPTION_REPOSITORY} from '../../constants';
import {User, UserCreationAttributes} from '../../user/entities/user.entity';
import {AccountService} from '../../accounts/account.service';
import {OrgUnitService} from '../../org-unit/org-unit.service';
import {EmailService} from '../../email/email.service';
import {UserCodeService} from '../user-code/user-code.service';
import {ConfigService} from '@nestjs/config';
import {uuid} from 'uuidv4';
import {Statuses} from '../../status/default-status';
import {QueryException, ValidationException} from '../../error/common.exception';
import {CodeType} from '../user-code/code_type';
import {UserErrors} from '../user/users.errors';
import {EmailTemplates} from '../../email/email.templates';
import {AccountTypes} from '../../account-type/dto/account-types';
import {CreateAccountDto} from '../../accounts/dto/create-account.dto';
import {CreateOrgUnitDto} from '../../org-unit/dto/create-org-unit.dto';
import {PasswordUtil} from '../../utils/password.util';
import {UserRoles} from '../../user/user.roles';
import {NumberUtils} from '../../utils/numberUtils';
import {GoogleOauthTokenDto} from '../../google-ouath/dto/google.oauth.token.dto';
import {PasswordCodeDto} from '../user/dto/password-code.dto';
import {ResetPasswordDto} from '../user/dto/reset-password.dto';
import {LoginDto} from '../user/dto/login.dto';
import {FilteredCategoryService} from '../../filtered-category/filtered-category.service';
import {LoginTokenResponseDto} from '../../auth/dto/login-token-response.dto';
import {CustomerService} from '../../billing/customer/customer.service';
import {SubscriptionService} from '../../billing/subscription/subscription.service';
import {PlanService} from '../../billing/plan/plan.service';
import {PlanTypes} from '../../billing/plan/plan-types';
import {QueryTypes} from 'sequelize';
import {Subscription} from '../../billing/subscription/entities/subscription.entity';
import {UserCodeCreationAttributes} from '../user-code/entities/user-code.entity';
import {ExpressConfig} from "apps/ml-api/src/app/config/express";

@Injectable()
export class AuthService {
  private readonly sequelize: Sequelize;
  private static DEFAULT_ROOT_ORG_UNIT: string = 'All';

  private readonly isDevelopment;

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly accountService: AccountService,
    private readonly orgUnitService: OrgUnitService,
    private readonly userService: ConsumerUserService,
    private readonly log: LoggingService,
    private readonly emailService: EmailService,
    private readonly userCodeService: UserCodeService,
    private readonly filteredCategoryService: FilteredCategoryService,
    private readonly config: ConfigService,
    private readonly customerService: CustomerService,
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: PlanService,
    @Inject(SEQUELIZE) sequelize: Sequelize,
    @Inject(SUBSCRIPTION_REPOSITORY) private readonly subscriptionRepo: typeof Subscription
  ) {
    this.sequelize = sequelize;
    this.isDevelopment = config.get<ExpressConfig>("expressConfig").isDevelopment()
  }

  /**
   * Sign up parent
   * @param dto create user request
   * @returns void
   */
  async signUp(dto: UserDto): Promise<LoginTokenResponseDto> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();

      const fullName = dto.firstName + ' ' + dto.lastName;
      const accountId = await this.createAccount(fullName, dto);

      const orgUnit = await this.createOrgUnit(AuthService.DEFAULT_ROOT_ORG_UNIT, dto, accountId);
      await this.filteredCategoryService.saveDefaultCategoriesForOrgUnit(accountId, orgUnit.id, null);
      const user = await this.createUser(dto, accountId, orgUnit.id);
      const userCode = await this.createUserCode(user);

      await transaction.commit();

      await this.sendEmail(user, userCode.code);
      return await this.generateToken(user.id, accountId);
    } catch (e) {
      await transaction.rollback();
      this.log.error(QueryException.save(e));
      throw new QueryException(QueryException.save());
    }
  }

  /**
   * Verify email
   * @param userId
   * @param accountId
   * @param accountId
   * @param code
   * @returns void
   */
  async verifyEmail(userId: string, accountId: string, code: string): Promise<void> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const userCode = await this.userCodeService.findOne(userId, CodeType.EMAIL);
      if (userCode && userCode.code === code) {
        await this.createCustomer(accountId);
        await this.userService.update(userCode.userId, {statusId: Statuses.ACTIVE});
        await transaction.commit();
        return;
      }
      throw new ValidationException(UserErrors.invalidCode());
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  /**
   * Verify email
   * @param userId
   * @returns void
   */
  async resendEmailCode(userId: string): Promise<void> {
    const userCode = await this.userCodeService.findOne(userId, CodeType.EMAIL);
    const user = await this.userService.findOneById(userId);
    if (userCode && user) {
      const emailCode = this.isDevelopment ? '111111' : NumberUtils.create6DigitRandom().toString();
      await this.userCodeService.update(userCode.userId, CodeType.EMAIL, emailCode);
      await this.emailService.sendEmail({
        id: uuid(),
        meta: {userId: user.id, VerificationCode: emailCode, firstName: user.firstName, lastName: user.lastName},
        to: user.email,
        content: {
          templateName: EmailTemplates.SignUp,
        },
      });
    } else {
      throw new ValidationException(UserErrors.notFound(userId));
    }
  }

  /**
   * Login user
   * @param createUserDto
   * @returns LoginTokenResponseDto
   */
  async login(createUserDto: LoginDto): Promise<LoginTokenResponseDto> {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    return await this.generateToken(user.id, user.accountId);
  }

  /**
   * Forgot password
   * @param email
   * @returns void
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new ValidationException(UserErrors.emailNotExists(email));
    }
    await this.userCodeService.deleteOne(user.id, CodeType.PASSWORD);
    const code = this.isDevelopment ? '111111' : NumberUtils.create6DigitRandom().toString();
    const userCodeDTO: UserCodeCreationAttributes = {
      userId: user.id,
      codeType: CodeType.PASSWORD,
      code: code,
    };
    await this.userCodeService.create(userCodeDTO);
    await this.emailService.sendEmail({
      id: uuid(),
      meta: {userId: user.id, VerificationCode: code},
      to: user.email,
      content: {
        templateName: EmailTemplates.PasswordReset,
      },
    });
  }

  /**
   * Verify password code
   * @param dto email code
   * @returns void
   */
  async verifyPasswordCode(dto: PasswordCodeDto): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);
    const userCode = await this.userCodeService.findOne(user?.id, CodeType.PASSWORD);
    if (!(user && userCode && userCode.code === dto.code)) {
      throw new ValidationException(UserErrors.invalidCode());
    }
  }

  /**
   * Reset password
   * @param dto email password
   * @returns void
   */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);
    if (user) {
      const password = await PasswordUtil.generate(dto.password);
      await this.userService.update(user.id, {password});
      return;
    }
    throw new ValidationException(UserErrors.emailNotExists(dto.email));
  }

  private async sendEmail(user: User, userCode: string) {
    await this.emailService.sendEmail({
      id: uuid(),
      meta: {userId: user.id, VerificationCode: userCode, firstName: user.firstName, lastName: user.lastName},
      to: user.email,
      content: {
        templateName: EmailTemplates.SignUp,
      },
    });
  }

  private async createAccount(fullName: string, dto: UserDto) {
    const accountDTO = {
      name: fullName,
      primaryDomain: dto.email,
      accountTypeId: AccountTypes.CONSUMER,
      onBoardingStatusId: Statuses.IN_PROGRESS,
    } as CreateAccountDto;
    const account = await this.accountService.create(accountDTO);
    return account.id;
  }

  private async createOrgUnit(fullName: string, dto: UserDto, accountId) {
    const orgUnitDTO = {
      name: fullName,
      googleOrgUnitId: 'id:' + dto.email,
      accountId: accountId,
      orgUnitPath: '/',
    } as CreateOrgUnitDto;

    return await this.orgUnitService.create(orgUnitDTO);
  }

  private async createUser(dto: UserDto, accountId, orgUnitId: string) {
    const userDTO: UserCreationAttributes = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: await PasswordUtil.generate(dto.password),
      accountId: accountId,
      orgUnitId: orgUnitId,
      role: UserRoles.PARENT,
      statusId: Statuses.PENDING,
      accessCode: null,
      accessLimited: false
    };
    return await this.userService.create(userDTO);
  }

  private async createUserCode(user: User) {
    const emailCode = this.isDevelopment ? '111111' : NumberUtils.create6DigitRandom().toString();
    const userCodeDTO: UserCodeCreationAttributes = {
      userId: user.id,
      codeType: CodeType.EMAIL,
      code: emailCode,
    };
    return await this.userCodeService.create(userCodeDTO);
  }

  private async generateToken(userId: string, accountId: string) {
    const payload = {
      userId: userId,
      accountId: accountId,
    } as GoogleOauthTokenDto;

    const jwt_token = await this.jwtTokenService.generateRegistrationToken(payload);
    return {jwt_token} as LoginTokenResponseDto;
  }

  private async createCustomer(accountId: string) {
    const account = await this.accountService.findOne(accountId);
    const stripeCustomerId = await this.customerService.createCustomer(accountId, account.primaryDomain, account.name);
    await this.accountService.update(accountId, {stripeCustomerId});
  }

  async migrateConsumers(): Promise<void> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const options = {where: {stripeCustomerId: null, accountTypeId: AccountTypes.CONSUMER}};
      const accounts = await this.accountService.findAll(options);
      for (const account of accounts) {
        //create customer
        const stripeCustomerId = await this.customerService.createCustomer(account.id, account.primaryDomain, account.name);
        await this.accountService.update(account.id, {stripeCustomerId});

        //create default free subscription
        const plan = await this.planService.findOneByType(PlanTypes.YEARLY);
        await this.subscriptionService.createStripeSubscription(account.id, plan.id, null, 365);
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      this.log.error(e);
    }
  }

  async migrateFreePlans(): Promise<void> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const query =
        'select ' +
        'p.id as planId, ' +
        'a.id as accountId ' +
        'from ' +
        'subscription s ' +
        'inner join account a on ' +
        's.account_id  = a.id ' +
        'inner join plan p on ' +
        's.plan_id = p.id ' +
        'where p.plan_type = :planType;';

      const subscriptions = await this.subscriptionRepo.sequelize.query(query, {
        replacements: {planType: 'FREE'},
        type: QueryTypes.SELECT,
        mapToModel: true,
        model: Subscription,
      });
      if (subscriptions && subscriptions.length > 0) {
        for (const sub of subscriptions) {
          await this.orgUnitService.updateCategories(sub.planId, sub.accountId, true);
        }
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      this.log.error(e);
    }
  }
}
