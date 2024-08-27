import {FilteredProcessService} from './../filtered-process/filtered-process.service';
import {Response} from 'express';
import moment from 'moment';
import fs from 'fs';
import * as path from 'path';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {FilteredUrlService} from '../filtered-url/filtered-url.service';
import {FilteredCategoryService} from '../filtered-category/filtered-category.service';
import {CalendarService} from '../calendar/calendar.service';
import {InterceptionTimeService} from '../interception-time/interception-time.service';
import {UserService} from '../user/user.service';
import {CreateFeedbackDto} from '../feedback/dto/create-feedback.dto';
import {FeedbackService} from '../feedback/feedback.service';
import {CreateWebTimeDto} from '../web-time/dto/create-web-time.dto';
import {WebTimeService} from '../web-time/web-time.service';
import {NonSchoolDaysConfigService} from '../non-school-days-config/non-school-days-config.service';
import {AccountService} from '../accounts/account.service';
import {CategoryDTO} from '../filtered-category/dto/filtered-category.dto';
import {CategoryTimeDto} from './domain/category.time.dto';
import {KidConfigService} from '../kid-config/kid-config.service';
import {OnboardStatusDto} from './domain/onboard.status.dto';
import {InterceptionTime} from '../interception-time/entities/interception-time.entity';
import {Feedback} from '../feedback/entities/feedback.entity';
import {User} from '../user/entities/user.entity';
import {KidRequestDto, KidRequestTypes} from '../kid-request/domain/kid-request-dto';
import {KidRequestService} from '../kid-request/kid-request.service';
import {EmailService} from '../email/email.service';
import {uuid} from 'uuidv4';
import {EmailTemplates} from '../email/email.templates';
import {JwtTokenService} from '../auth/jwtToken/jwt.token.service';
import {QueryException} from '../error/common.exception';
import {LoggingService} from '../logger/logging.service';
import {ConfigService} from '@nestjs/config';
import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE} from '../constants';
import {UserErrors} from '../error/users.errors';
import {ExtensionStatus} from '../kid-config/enum/extension-status';
import {ParentEmailConfigService} from '../parent-email-config/parent-email-config.service';
import {LimitAccessDTO} from './domain/limit_access.dto';
import {KidConfigDTO} from '../kid-config/dto/kid-config.dto';
import {SubscriptionService} from '../billing/subscription/subscription.service';
import {Account} from './../accounts/entities/account.entity';
import {Plan} from '../billing/plan/entities/plan.entity';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";

@Injectable()
export class ChromeService {
  private readonly WEB_URL: string;
  private readonly sequelize: Sequelize;

  constructor(
    private readonly filteredUrlsService: FilteredUrlService,
    private readonly filteredCategoryService: FilteredCategoryService,
    private readonly calendarService: CalendarService,
    private readonly interceptionTimeService: InterceptionTimeService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly webTimeService: WebTimeService,
    private readonly feedbackService: FeedbackService,
    private readonly nonSchoolDaysConfigService: NonSchoolDaysConfigService,
    private readonly kidConfigService: KidConfigService,
    private readonly kidRequestService: KidRequestService,
    private readonly emailService: EmailService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly parentEmailConfigService: ParentEmailConfigService,
    private readonly log: LoggingService,
    private readonly subscriptionService: SubscriptionService,
    private readonly filteredProcessService: FilteredProcessService,
    private readonly config: ConfigService,
    @Inject(SEQUELIZE) sequelize: Sequelize
  ) {
    this.log.className(ChromeService.name);
    this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
    this.sequelize = sequelize;
  }

  /** Get extension configuration for consumer
   * @param accountId
   * @param userId
   * @param orgUnitId
   * @package userDeviceLinkId
   * @package userDeviceLinkId
   */
  async getWebFilterConfiguration(accountId: string, userId: string, orgUnitId: string, userDeviceLinkId: string) {
    const urls: any = await this.filteredUrlsService.findAllTypeUrls(accountId, userId);
    const filteredCategories = await this.filteredCategoryService.findAllByAccountAndUserId(accountId, userId, orgUnitId);
    urls.filteredCategories = filteredCategories
      .map((o) => {
        return {
          categoryId: o.categoryId,
          status: o.status,
          timeDuration: o.timeDuration,
        };
      })
      .map((o) => {
        return {
          categoryId: o.categoryId,
          status: o.status,
          timeDuration: o.timeDuration,
        };
      });
    const account = await this.accountService.findOne(accountId);
    urls.interceptionCategories = account.interceptionCategories;
    urls.kidConfig = await this.kidConfigService.fetch(userId);

    const userObj: User = await this.userService.findOneById(userId);
    urls.accessLimited = userObj.accessLimited;

    const subscription = await this.subscriptionService.findOneByAccountId(accountId);
    if (!subscription) {
      urls.subscription = false;
      if (!account.notifyExpiredExtension) {
        this.notifiyExtenionExpiredStatus(account);
        await this.accountService.update(accountId, {notifyExpiredExtension: true});
      }
    } else {
      urls.subscription = true;
    }

    const events = await this.kidRequestService.findAllByUserDeviceId(userDeviceLinkId, 10);
    urls.informUrls = events?.INFORM;

    const exemptedProcesses = await this.filteredProcessService.findAllByOrgUnitId(orgUnitId, accountId);
    urls.exemptedProcesses = exemptedProcesses?.map((process) => process.name);

    return urls;
  }

  /** Check holiday status
   * @param accountId
   * @param date
   * @returns holiday status
   */
  async checkHoliday(accountId: string, date: string): Promise<{ holiday: boolean }> {
    const givenDate = new Date(Date.parse(date));
    let result = await this.calendarService.checkHoliday(accountId, givenDate);
    const nonSchoolDayConfig = await this.nonSchoolDaysConfigService.findByAccountId(accountId);
    if (!result && nonSchoolDayConfig && nonSchoolDayConfig.weekendsEnabled && (givenDate.getDay() === 6 || givenDate.getDay() === 0)) {
      result = true;
    }
    return {holiday: result};
  }

  /** Get intercept times
   * @param accountId
   * @returns intercept times
   */
  async getInterceptTimes(accountId: string): Promise<InterceptionTime> {
    return await this.interceptionTimeService.findByAccountId(accountId);
  }

  /** Update access limit
   * @param userId
   * @param accountId
   * @param dto
   * @returns void
   */
  async updateAccessLimit(userId: string, accountId: string, dto: LimitAccessDTO): Promise<void> {
    const accessLimitedAt = new Date();
    if (dto.accessLimited) {
      await this.kidConfigService.update(userId, {accessLimitedAt: accessLimitedAt});
      const user = await this.userService.findParentAccount(accountId);
      const kid = await this.userService.findOneById(userId);
      const kidName = `${kid.firstName} ${kid.lastName}`;
      const token = await this.jwtTokenService.generateChromeExtensionToken({userId, kidName});
      accessLimitedAt.setMinutes(accessLimitedAt.getMinutes() + 5);
      await this.emailService.sendEmail({
        id: uuid(),
        useSupportEmail: true,
        meta: {
          kidName,
          category: dto.category.replace(/_/g, ' '),
          settingsUrl: `${this.WEB_URL}/settings`,
          updateLink: `${this.WEB_URL}/dashboard?access-request=${token.jwt_token}`,
          time: moment(accessLimitedAt).format('hh:mm A'),
        },
        to: user.email,
        content: {
          templateName: EmailTemplates.INFORM_LIMIT_ACCESS_PARENT,
        },
      });
    } else {
      await this.kidConfigService.update(userId, {accessLimitedAt: null});
    }
    await this.userService.limitAccess(userId, dto.accessLimited);
  }

  /** Check access limit
   * @param userId
   * @param accountId
   * @returns accessLimit status
   */
  async isAccessLimited(accountId: string, userId: string): Promise<{ accessLimited: boolean | undefined; accessLimitedAt: Date | null }> {
    const user = await this.userService.findOneByAccountId(accountId, userId);
    const kidConfig: KidConfigDTO = await this.kidConfigService.fetch(userId);
    return {accessLimited: user?.accessLimited, accessLimitedAt: kidConfig?.accessLimitedAt};
  }

  /** Save feed for single kid
   * @param deviceLinkId
   * @param accountId
   * @param feedback
   * @returns Feedback
   */
  async saveFeedback(accountId: string, deviceLinkId: string, feedback: CreateFeedbackDto): Promise<Feedback> {
    feedback.userDeviceLinkId = deviceLinkId;
    feedback.accountId = accountId;
    return await this.feedbackService.create(feedback);
  }

  /** Save web time for kid
   * @param webTime
   * @returns void
   */
  async saveWebTime(webTime: CreateWebTimeDto): Promise<void> {
    const user = await this.userService.findOneById(webTime.userId);
    webTime.userId = user.id;
    webTime.userEmail = user.email;
    webTime.orgUnitId = user.orgUnitId;
    await this.webTimeService.create(webTime);
  }

  /** Find parent for kid
   * @param accountId
   * @returns parent of kid
   */
  async findParent(accountId: string): Promise<User> {
    return await this.userService.findParentAccount(accountId);
  }

  /**
   * Update category
   * @param dto
   * @param accountId
   * @param orgUnitId
   */
  async updateCategory(accountId: string, orgUnitId: string, dto: CategoryDTO): Promise<void> {
    await this.filteredCategoryService.updateCategory(accountId, orgUnitId, dto.id, {status: dto.status});
  }

  /**
   * Update category and kid config
   * @param categoryTime
   * @param accountId
   * @param orgUnitId
   * @param userId
   */
  async updateCategoryTimeAndConfig(accountId: string, orgUnitId: string, userId: string, categoryTime: CategoryTimeDto): Promise<void> {
    for (const category of categoryTime.categories) {
      await this.filteredCategoryService.updateCategory(accountId, orgUnitId, category.id, {timeDuration: category.timeDuration});
    }
    await this.kidConfigService.update(userId, {offTime: categoryTime.offTime});
  }

  /**
   * Update user onboard status
   * @param onboardStatusDto
   * @param userId
   */
  async updateOnBoardingStatus(userId: string, onboardStatusDto: OnboardStatusDto): Promise<void> {
    await this.kidConfigService.update(userId, onboardStatusDto);
  }

  /**
   * Get user onboard status
   * @param userId
   */
  async getOnBoardingStatus(userId: string, accountId: string): Promise<KidConfigDTO> {
    const kidConfigData: KidConfigDTO = await this.kidConfigService.fetch(userId);
    const plan: Plan = await this.subscriptionService.getSubscriptionPlanByAccountId(accountId);
    // convert to plain javascript object -> then added planType field
    const kidConfig: KidConfigDTO = JSON.parse(JSON.stringify(kidConfigData));
    kidConfig.planType = plan?.planType;
    return kidConfig;
  }

  /**
   * Save access host request and send email to parent
   * @param kidId
   * @param accountId
   * @param orgUnitId
   * @param kidRequestDto
   */
  async saveKidRequests(kidId: string, accountId: string, orgUnitId: string, kidRequestDto: KidRequestDto): Promise<void> {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();
      const kid = await this.userService.findOneById(kidId);
      const parent = await this.userService.findParentAccount(accountId);
      kidRequestDto.kidId = kidId;
      kidRequestDto.userId = parent.id;
      const kidReq = await this.kidRequestService.findOne(kidRequestDto.url, kidId);
      let requestId: string;
      //if same url request already exists and access was not granted then only update updatedAt column and send email
      //if same url request already exists and access was not granted then only update updatedAt column and send email
      if (kidReq && kidReq.length > 0 && !kidReq[0].accessGranted) {
        requestId = kidReq[0].id;
        await this.kidRequestService.updateDate(requestId, kidRequestDto.requestTime);
        this.notifyParent(kidRequestDto, orgUnitId, requestId, kid, parent);
        await transaction.commit();
        return;
      }
      //if same url request already exists and access was granted then update accessGranted column to false and send email
      //if same url request already exists and access was granted then update accessGranted column to false and send email
      if (kidReq && kidReq.length > 0 && kidReq[0].accessGranted) {
        requestId = kidReq[0].id;
        await this.kidRequestService.updateAccessGranted(kidId, kidRequestDto.url, false);
        this.notifyParent(kidRequestDto, orgUnitId, requestId, kid, parent);
        await transaction.commit();
        return;
      }
      //if same url request does not exist then create request and send email
      const kidRequest = await this.kidRequestService.create(kidRequestDto);
      requestId = kidRequest.id;
      await transaction.commit();
      this.notifyParent(kidRequestDto, orgUnitId, requestId, kid, parent);
    } catch (error) {
      this.log.error(QueryException.save(error));
      await transaction.rollback();
      throw new QueryException(QueryException.save());
    }
  }

  private async notifyParent(kidRequestDto: KidRequestDto, orgUnitId: string, requestId: string, kid: User, parent: User) {
    const payload = {
      kidId: kid?.id,
      url: kidRequestDto.url,
      orgUnitId,
      id: requestId,
    };
    const token = await this.jwtTokenService.generateChromeExtensionToken(payload);
    this.emailService.sendEmail({
      to: parent.email,
      id: uuid(),
      useSupportEmail: true,
      meta: {
        kidName: `${kid.firstName} ${kid.lastName}`,
        category: kidRequestDto.categoryId.replace(/_/g, ' '),
        url: kidRequestDto.url,
        settingsUrl: `${this.WEB_URL}/settings`,
        updateLink: `${this.WEB_URL}/settings?kid-request=${token.jwt_token}`,
      },
      content: {
        templateName: this.getTemplateName(kidRequestDto),
      },
    });
  }

  private getTemplateName(kidRequestDto: KidRequestDto): string {
    if (kidRequestDto.type === KidRequestTypes.INFORM_AI) {
      return EmailTemplates.INFORM_PARENT_AI;
    } else if (kidRequestDto.type === KidRequestTypes.ASK) {
      return EmailTemplates.ASK_PARENT;
    } else {
      return EmailTemplates.INFORM_PARENT_URL;
    }
  }

  /**
   * Update extension status and send email to parent
   * @param accessCode
   */
  async updateExtensionStatus(accessCode: string, res: Response): Promise<void> {
    try {
      const user = await this.userService.findUserByAccessCode(accessCode);
      if (!user) {
        this.log.error(UserErrors.codeNotFound(accessCode));
        throw new NotFoundException(UserErrors.codeNotFound(accessCode));
      }

      const updateStatusPayload = {extensionStatus: ExtensionStatus.UNINSTALLED, extensionStatusUpdatedAt: moment()};
      await this.kidConfigService.update(user.id, updateStatusPayload);

      const parent = await this.userService.findParentAccount(user.accountId);
      this.emailService.sendEmail({
        id: uuid(),
        useSupportEmail: true,
        meta: {
          kidName: `${user.firstName} ${user.lastName}`,
        },
        to: parent.email,
        content: {
          templateName: EmailTemplates.EXTENSION_UNINSTALL,
        },
      });

      // load web page
      const filePath = path.resolve(__dirname + '/templates/uninstall-extension.html');
      const html = fs.readFileSync(filePath);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    } catch (error) {
      this.log.error(QueryException.save(error));
      const filePath = path.resolve(__dirname + '/templates/uninstall-extension-404.html');
      const html = fs.readFileSync(filePath);
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end(html);
    }
  }

  /**
   * Update extension status to uninstalled and send email to parent
   * @param userId
   * @param accountId
   */
  async extUninstallInform(userId: string, accountId: string): Promise<void> {
    const kidConfig = await this.kidConfigService.fetch(userId);
    if (kidConfig?.extensionStatusUpdatedAt) {
      const minDiff = moment.utc(moment(moment(), 'HH:mm:ss').diff(moment(kidConfig.extensionStatusUpdatedAt, 'HH:mm:ss'))).format('mm');
      if (kidConfig && parseInt(minDiff) <= 5) {
        return;
      }
    }
    const updateStatusPayload = {extensionStatus: ExtensionStatus.UNINSTALLED, extensionStatusUpdatedAt: moment()};
    await this.kidConfigService.update(userId, updateStatusPayload);

    const user = await this.userService.findOneById(userId);
    const account = await this.accountService.findOne(accountId);
    const payload = {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      parentEmail: account.primaryDomain,
    };
    await this.parentEmailConfigService.sendMessage(payload);
  }

  /**
   * Update extension status to installed
   * @param userId
   */
  async extUninstallCancel(userId: string): Promise<void> {
    const updateStatusPayload = {extensionStatus: ExtensionStatus.INSTALLED, extensionStatusUpdatedAt: null};
    await this.kidConfigService.update(userId, updateStatusPayload);
  }

  /**
   * Inform parent that kid triggered AI  PRR level 3 category
   * @param kidId
   * @param accountId
   * @param kidRequestDto
   */
  async informAICrisis(kidId: string, accountId: string, kidRequestDto: KidRequestDto): Promise<void> {
    const user = await this.userService.findOneById(kidId);
    const parent = await this.userService.findParentAccount(accountId);
    await this.emailService.sendEmail({
      id: uuid(),
      useSupportEmail: true,
      meta: {
        kidName: `${user.firstName} ${user.lastName}`,
        category: kidRequestDto.categoryId.replace(/_/g, ' '),
        url: kidRequestDto.url,
        choseToContinue: kidRequestDto.choseToContinue ? 'to continue' : 'not to continue',
      },
      to: parent.email,
      content: {
        templateName: EmailTemplates.INFORM_LEVEL_THREE_AI,
      },
    });
  }

  /**
   * Inform parent that kid triggered AI  PRR level 3 category
   * @param account
   */
  async notifiyExtenionExpiredStatus(account: Account): Promise<void> {
    this.emailService.sendEmail({
      id: uuid(),
      useSupportEmail: true,
      meta: {
        parentName: account.name,
      },
      to: account.primaryDomain,
      content: {
        templateName: EmailTemplates.EXTENSION_SUBSCRIPTION_EXPIRED,
      },
    });
  }
}
