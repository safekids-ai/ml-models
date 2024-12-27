import {HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreatePrrNotificationDto, PrrNotificationDto} from './dto/create-prr-notification.dto';
import {UpdatePrrNotificationDto} from './dto/update-prr-notification.dto';
import {PRRNOTIFICATION_REPOSITORY} from '../constants';
import {PrrNotification} from './entities/prr-notification.entity';
import {Activity} from '../activity/entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';
import {QueryTypes} from 'sequelize';
import {getPagination, getPagingData} from '../paging/paging.util';
import {PrrSmsNotificationService} from './prr.sms.notification.service';
import {UserErrors} from '../error/users.errors';
import {ValidationException} from '../error/common.exception';
import {JwtTokenService} from '../auth/jwtToken/jwt.token.service';
import {LoggingService} from '../logger/logging.service';
import {AccountService} from '../accounts/account.service';
import {PrrMessageErrors} from './prr.message.errors';
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class PrrNotificationService {
  constructor(
    @Inject(PRRNOTIFICATION_REPOSITORY) private repository: typeof PrrNotification,
    private prrSmsNotificationService: PrrSmsNotificationService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly log: LoggingService,
    private readonly accountService: AccountService
  ) {
    this.log.className(PrrNotificationService.name);
  }

  create(createPrrNotificationDto: CreatePrrNotificationDto) {
    if (!createPrrNotificationDto.id) createPrrNotificationDto.id = uuidv4().replace(/-/g, '');
    return this.repository.create(createPrrNotificationDto);
  }

  async findAllNotReadByAccountId(page: number = 0, size: number = 5, accountId: string) {
    const {limit, offset} = getPagination(page, size);
    const results = await this.repository.sequelize.query(
      'SELECT c.id as id,user_name as kidName,user_email as kidEmail,prr_category_id as category,' +
      'a.web_url as url,c.url as notificationUrl,c.phone_number as phoneNumber, c.contact,prr_level_id as prrLevel, a.id as activityId, a.account_id as accountId,c.read,c.expired ' +
      ' FROM prr_notification c ' +
      'INNER JOIN activity a ON a.id = c.activity_id' +
      ' where c.read=0 and c.expired = 0 ' +
      ' limit :limit offset :offset',
      {
        replacements: {limit, offset, accountId},
        type: QueryTypes.SELECT,
      }
    );

    return getPagingData(results, page, limit);
  }

  async findAllNotRead(page: number = 0, size: number = 5) {
    const {limit, offset} = getPagination(page, size);
    const results = await this.repository.sequelize.query(
      'SELECT c.id as id,user_name as kidName,user_email as kidEmail,prr_category_id as category,' +
      'a.web_url as url,c.url as notificationUrl,c.phone_number as phoneNumber, c.contact,prr_level_id as prrLevel, a.id as activityId, a.account_id as accountId,c.read,c.expired ' +
      ' FROM prr_notification c ' +
      'INNER JOIN activity a ON a.id = c.activity_id' +
      ' where c.read=0 and c.expired = 0 ' +
      ' limit :limit offset :offset',
      {
        replacements: {limit, offset},
        type: QueryTypes.SELECT,
      }
    );

    return getPagingData(results, page, limit);
  }

  async findOneByCode(id: string) {
    const results = await this.repository.sequelize.query(
      'SELECT c.id as id,user_name as kidName,user_email as kidEmail,prr_category_id as category,' +
      'a.web_url as url,c.url as notificationUrl,c.phone_number as phoneNumber, c.contact,prr_level_id as prrLevel,' +
      ' a.id as activityId, a.account_id as accountId,c.read, a.activity_time as activityTime ' +
      ' FROM prr_notification c ' +
      'INNER JOIN activity a ON a.id = c.activity_id ' +
      'WHERE c.id = :crisesId',
      {
        replacements: {crisesId: id},
        type: QueryTypes.SELECT,
      }
    );

    if (results[0] == undefined) {
      return null;
    }

    const data: any = results[0];

    return data;
  }

  async findOneById(id: string) {
    return await this.repository.findOne({where: {id}});
  }

  findOneByActivityId(id: string) {
    return this.repository.findOne({where: {activityId: id}, include: [Activity], attributes: ['userName']});
  }

  update(id: string, updatePrrNotificationDto: UpdatePrrNotificationDto) {
    return this.repository.update(updatePrrNotificationDto, {where: {id}});
  }

  markRead(id: string, updatePrrNotificationDto: UpdatePrrNotificationDto) {
    return this.repository.update(updatePrrNotificationDto, {where: {id}});
  }

  remove(id: string) {
    return this.repository.destroy({where: {id}});
  }

  async createNotification(createPrrNotificationDto: CreatePrrNotificationDto) {
    if (!createPrrNotificationDto.id) createPrrNotificationDto.id = uuidv4().replace(/-/g, '');
    const notification = await this.repository.create(createPrrNotificationDto);
    const message = await this.findOneByCode(notification.id);
    await this.prrSmsNotificationService.sendMessage(message);
  }

  async processNotification(id: string) {
    //TODO: do proper error handling
    const message = await this.findOneByCode(id);
    if (!message) {
      throw 'Notification not found';
    }

    if (message.read) {
      console.log(`Notification has been read already.`);
      throw 'Notification has been read already.';
    }
    //set the status as read
    await this.update(id, {read: true, readAt: new Date()});

    let sms = {
      contact: message.contact,
      phoneNumber: message.phoneNumber,
      kidName: message.kidName,
      type: 'PRR_MESSAGE_RESPONSE',
    };
    await this.prrSmsNotificationService.sendMessage(sms);
  }

  /** Verify token and return response
   * @param  token
   * @returns
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtTokenService.verifyToken(token);
      const accountId = payload?.accountId;
      const id = payload?.id;

      const notification = await this.findOneByCode(id);
      if (!notification) {
        throw new NotFoundException(PrrMessageErrors.notFound(String(id)));
      }
      if (notification.read) {
        this.log.error('Notification has been read already.');
      }
      const account = await this.accountService.findOne(accountId);
      if (!account) {
        throw new NotFoundException(UserErrors.notFound(String(accountId)));
      }
      await this.update(id, {read: true, readAt: new Date()});

      return {
        kidName: notification.kidName,
        userName: account.emergencyContactName,
        schoolName: account.primaryDomain,
        lastIntercept: notification.url,
        category: notification.category,
        activityTime: notification.activityTime,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        this.log.error(JSON.stringify(e));
        throw e;
      }
      this.log.error(UserErrors.sessionExpired(), e);
      throw new ValidationException(UserErrors.sessionExpired(), HttpStatus.BAD_REQUEST);
    }
  }

  //todo commenting out sms sending job after every 3 minutes for now
  // @Cron("*/3 * * * *")
  async crisisJob(): Promise<void> {
    const notifications = await this.repository.findAll({
      attributes: ['id'],
      where: {read: false, readAt: null},
    });
    for (const notification of notifications) {
      const message = await this.findOneByCode(notification.id);
      const prrNotificationDto = {
        id: message.id,
        accountId: message.accountId,
        category: message.category,
        kidName: message.kidName,
        phoneNumber: message.phoneNumber,
      } as PrrNotificationDto;
      await this.prrSmsNotificationService.sendPRRSms(prrNotificationDto);
    }
  }
}
