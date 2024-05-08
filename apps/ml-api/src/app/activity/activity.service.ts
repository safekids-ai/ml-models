import {Inject, Injectable} from '@nestjs/common';
import {ACTIVITY_REPOSITORY, SEQUELIZE} from '../constants';
import {Activity, ActivityCreationAttributes} from './entities/activity.entity';
import {getPagination, getPagingData} from '../paging/paging.util';
import {QueryTypes} from 'sequelize';
import {PrrActivityDto} from '../chrome/dto/prr.activity.dto';
import {UserService} from '../user/user.service';
import {PrrNotificationService} from '../prr-notification/prr-notification.service';
import {AccountService} from '../accounts/account.service';
import {CreatePrrNotificationDto} from '../prr-notification/dto/create-prr-notification.dto';
import {LoggingService} from '../logger/logging.service';
import {uuid} from 'uuidv4';
import {Categories} from '../category/default-categories';
import {CountResponse, PreviewResultDto, PrrInfoDto, UserInfoDto} from './dto/preview-result.dto';
import {getPrrLevelName} from './prr-level-names';
import {QueryException} from '../error/common.exception';
import {EmailService} from '../email/email.service';
import {AccountTypes} from '../account-type/account-type.enum';
import {PrrLevels} from '../prr-level/prr-level.default';
import {EmailTemplates} from '../email/email.templates';
import {Sequelize} from 'sequelize-typescript';
import {QueueServiceInterface} from '../email/email.interfaces';
import retry from 'async-retry';
import {PrrActivityRequest} from '../chrome/dto/prr.activity.request';
import {User} from '../user/entities/user.entity';
import {prrLevel} from '../domain';
import {ActivityAiDataCreationAttributes} from '../activity-ai-data/entities/activity-ai-datum.entity';
import {ActivityAiDataService} from '../activity-ai-data/activity-ai-data.service';
import {ConfigService} from '@nestjs/config';
import Queue from 'bee-queue';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import {QueueConfig, QueueConfigItem} from "apps/ml-api/src/app/config/queue";

import { AsyncParser } from '@json2csv/node';
import {WebAppConfig} from "../config/webapp";
const Json2csvParser = new AsyncParser();

@Injectable()
export class ActivityService implements QueueServiceInterface {
  private readonly DEFAULT_PAGE_LIMIT: number;
  private readonly sequelize: Sequelize;

  private readonly WEB_URL: string;

  private queue: Queue
  private readonly queueConfig: QueueConfigItem
  private readonly retryOptions;

  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly repository: typeof Activity,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly crisesManagementService: PrrNotificationService,
    private readonly log: LoggingService,
    @Inject(SEQUELIZE) sequelize: Sequelize,
    private readonly config: ConfigService,
    private readonly activityAiDataService: ActivityAiDataService,
    private readonly emailService: EmailService
  ) {
    this.log.className(ActivityService.name);
    this.DEFAULT_PAGE_LIMIT = 15;
    this.WEB_URL = this.config.get<WebAppConfig>("webAppConfig").url;

    this.queueConfig = config.get<QueueConfig>('queueConfig').standardQueueEmail;

    if (!this.queueConfig || !this.queueConfig.name || !this.queueConfig.url) {
      throw new Error('Please define proper name for activity service queue and url')
    }
  }

  async onModuleInit(): Promise<void> {
    const redisConnectionOptions: RedisClientOptions = {
      url: this.queueConfig.url
    };

    const queueSettings: Queue.QueueSettings = {
      prefix: 'safekids',
      autoConnect: true,
      removeOnFailure: false,
      removeOnSuccess: true,
      stallInterval: 5000,
      redis: createRedisClient(redisConnectionOptions),
    };
    this.queue = new Queue(this.queueConfig.name, queueSettings);
    await this.listener();
    this.log.info(`A listener called ${this.queueConfig.name} is setup for queue `, this.queueConfig.url);
  }

  create(createActivityDto: ActivityCreationAttributes) {
    return this.repository.create(createActivityDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne({where: {id}});
  }

  update(id: number, updateActivityDto: Partial<ActivityCreationAttributes>) {
    return this.repository.update(updateActivityDto, {where: {id}});
  }

  upsert(dto: ActivityCreationAttributes) {
    return this.repository.upsert(dto);
  }

  remove(id: number) {
    return this.repository.destroy({where: {id}});
  }

  async findAllByTeacherId(page = 0, size = 100, accountId, teacherId, start: string, end: string) {
    const results = await this.repository.sequelize.query(
      `SELECT a.id,
                    user_id          AS userId,
                    u.first_name     AS firstName,
                    u.last_name      AS lastName,
                    a.teacher_name   AS teacherName,
                    u.school_name    AS schoolName,
                    web_url          AS webUrl,
                    full_web_url     AS fullWebUrl,
                    c.name           AS prrCategory,
                    prr_messages     AS prrMessages,
                    activity_time    AS activityTime,
                    u.access_limited as accessLimited
             FROM activity a
                      INNER JOIN user u on u.id = user_id
                      INNER JOIN category c on c.id = prr_category_id
             WHERE a.account_id = :accountId ${start && end ? `AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end)` : ``}
          AND a.prr_level_id = '2'
          AND a.access_limited = 1
             ORDER BY
                 a.activity_time DESC
                 LIMIT :page, :size `,
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          page: +page,
          size: +size,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    return results;
  }

  async findTopCategoriesByAccount(accountId: string, start: Date, end: Date, limit = 5) {
    const query =
      'select ' +
      'ca.name as category, ' +
      'COUNT(*) as count ' +
      'from ' +
      'activity a ' +
      'inner join category ca on ' +
      'ca.id = a.prr_category_id ' +
      'where ' +
      'ca.enabled = 1 ' +
      'and is_offday = false ' +
      'and is_offtime = false ' +
      'and a.account_id = :accountId ' +
      'and DATE(activity_time) between DATE(:start) and DATE(:end) ' +
      'and prr_level_id is not null ' +
      'group by ' +
      'prr_category_id ' +
      'order by ' +
      'count desc ' +
      'limit :limit;';
    const results = await this.repository.sequelize.query(query, {
      replacements: {
        accountId: accountId,
        start: start,
        end: end,
        limit: limit,
      },
      type: QueryTypes.SELECT,
      mapToModel: true,
    });
    const sum = results?.reduce((accumulator, current: { count: number }) => accumulator + current.count, 0);
    return {
      sum: sum,
      list: results,
    };
  }

  async findTopCategoriesByUser(userId: string, start: Date, end: Date, limit = 5) {
    const query =
      'select ' +
      'ca.name as name, ' +
      'COUNT(*) as count ' +
      'from ' +
      'activity a ' +
      'inner join category ca on ' +
      'ca.id = a.prr_category_id ' +
      'where ' +
      'ca.enabled = 1 ' +
      'and is_offday = false ' +
      'and is_offtime = false ' +
      'and a.user_id = :userId ' +
      'and DATE(activity_time) between DATE(:start) and DATE(:end) ' +
      'and prr_level_id is not null ' +
      'group by ' +
      'prr_category_id ' +
      'order by ' +
      'count desc ' +
      'limit :limit;';
    return await this.repository.sequelize.query(query, {
      replacements: {
        userId,
        start: start,
        end: end,
        limit: limit,
      },
      type: QueryTypes.SELECT,
      mapToModel: true,
    });
  }

  async findTopURLs(accountId: string, start: Date, end: Date, orgPath: string, limit: number = 5) {
    const results = await this.repository.sequelize.query(
      'SELECT web_url as url,COUNT(*) as count FROM activity a ' +
      'WHERE is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) AND prr_level_id' +
      " IS NOT NULL AND web_url <>'' " +
      'GROUP BY web_url ORDER BY count DESC limit :limit',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          limit: limit,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const sum = results?.reduce((accumulator, current: { count: number }) => accumulator + current.count, 0);
    return {
      sum: sum,
      list: results,
    };
  }

  async findInterceptionsPercentageChange(accountId: string, start: Date, end: Date, orgPath: string): Promise<any> {
    // @ts-ignore
    const timeDifference = new Date(end) - new Date(start);
    const diffDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

    const count1Query =
      'SELECT COUNT(*) AS counting FROM activity a ' +
      'WHERE is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) ' +
      'AND prr_level_id = 1 ';
    const currentPeriodCount: any = await this.repository.sequelize.query(count1Query, {
      replacements: {accountId: accountId, start: start, end: end},
      type: QueryTypes.SELECT,
      mapToModel: true,
    });

    const countQuery2 =
      'SELECT COUNT(*) AS counting FROM activity a ' +
      'WHERE is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE_SUB(:start, INTERVAL :dayDiff DAY) AND  DATE_SUB(:end, INTERVAL 1 DAY) ' +
      'AND prr_level_id = 1 ';
    const previousPeriodCount: any = await this.repository.sequelize.query(countQuery2, {
      // @ts-ignore
      replacements: {
        accountId: accountId,
        start: start,
        end: start,
        dayDiff: diffDays,
      },
      type: QueryTypes.SELECT,
      mapToModel: true,
    });
    const percentageDifference =
      previousPeriodCount[0].counting === 0 && currentPeriodCount[0].counting > 0
        ? 100
        : ((currentPeriodCount[0].counting - previousPeriodCount[0].counting) / previousPeriodCount[0].counting) * 100;

    let average = currentPeriodCount[0].counting / diffDays;
    average = +average.toFixed(2);

    return {
      since: start,
      percentage: percentageDifference,
      average: average,
    };
  }

  async findAverageInterceptions(accountId: string, start: Date, end: Date, orgPath: string): Promise<any> {
    // @ts-ignore
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const count: any = await this.repository.sequelize.query(
      'SELECT COUNT(*) AS counting FROM activity a ' +
      'WHERE is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) ' +
      'AND prr_level_id = 1 ',
      {
        replacements: {accountId: accountId, start: start, end: end},
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const average = count / diffDays;

    return average;
  }

  async findTopInterceptions(accountId: string, start: Date, end: Date, orgPath: string) {
    const topCategory: any = await this.repository.sequelize.query(
      'SELECT ca.name as category,COUNT(*) AS counting FROM activity a ' +
      'INNER JOIN category ca ON ca.id=prr_category_id ' +
      'WHERE ca.enabled = 1 AND is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) AND prr_level_id =1 ' +
      'GROUP BY prr_category_id ORDER BY counting DESC LIMIT 1',
      {
        replacements: {accountId: accountId, start: start, end: end},
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const topUrl: any = await this.repository.sequelize.query(
      'SELECT web_url,COUNT(*) AS counting FROM activity a ' +
      'WHERE is_offday=FALSE AND is_offtime=FALSE ' +
      'AND a.account_id=:accountId AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) AND prr_level_id =1 ' +
      'GROUP BY web_url ORDER BY counting DESC LIMIT 1',
      {
        replacements: {accountId: accountId, start: start, end: end},
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );

    return {
      topCategory: topCategory[0]?.category,
      topUrl: topUrl[0]?.web_url,
    };
  }

  async findAllPrrLevel3(page: number, size: number, accountId: string, start: Date, end: Date, orgPath: string) {
    const {limit, offset} = getPagination(page, size);
    const countResult: any = await this.repository.sequelize.query(
      'SELECT COUNT(DISTINCT(user_id)) as counting FROM activity a ' +
      ' where exists (select 1 from prr_notification pn where pn.activity_id = a.id and pn.read = 0 ) ' +
      ' AND a.account_id=:accountId  ' +
      ' AND prr_level_id = 3',
      {
        replacements: {accountId: accountId},
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );

    let replacement: any = {accountId: accountId};
    let query =
      'SELECT u.id, a.user_id, a.user_email,' +
      'u.first_name as firstName,u.last_name as lastName, u.primary_email,a.school_name as schoolName,u.access_limited,a.web_url as webUrl,\n' +
      'a.full_web_url as webUrl ,a.prr_level_id,ca.name as prrCategory,a.activity_time as date,pn.read  FROM activity a ' +
      'INNER JOIN prr_notification pn ON pn.activity_id=a.id ' +
      'INNER JOIN category ca ON ca.id=a.prr_category_id ' +
      'INNER JOIN user u ON u.id = a.user_id ' +
      'WHERE a.account_id=:accountId  ' +
      'AND prr_level_id = 3 ORDER BY activity_time DESC';

    if (size && page) {
      query = query + ' LIMIT :limit OFFSET :offset';
      replacement = {accountId: accountId, limit, offset};
    }
    const dataResult = await this.repository.sequelize.query(query, {
      replacements: replacement,
      type: QueryTypes.SELECT,
      mapToModel: true,
    });
    return {
      totalKids: countResult[0].counting,
      totalItems: countResult[0].counting,
      items: dataResult,
    };
  }

  async findAllNotIntercepted(page: number, size: number, accountId: string, start: Date, end: Date, orderBy: string, orgPath: string) {
    const {limit, offset} = getPagination(page, size);
    const results = await this.repository.sequelize.query(
      'SELECT distinct web_url AS webUrl,' +
      " CASE WHEN UPPER(ca.name) = 'PERMISSIBLE' THEN 'Uncategorized' ELSE ca.name END as category," +
      ' count(*) AS count,' +
      ' CASE WHEN SUM(prr_level_id) > 0 THEN 1 ELSE 0 END as isIntercept ' +
      ' FROM activity a ' +
      ' INNER JOIN `account` ON account.id = a.account_id ' +
      ' INNER JOIN category ca ON a.web_category_id  = ca.id ' +
      " WHERE a.account_id=:accountId  and ca.id <> 'ACCESS_LIMITED' and (web_url not like '%google.com%' AND web_category_id <> 'SEARCH_ENGINES' ) " +
      " and is_offday=0 and is_offtime=0 and (web_url is not null and web_url <> '') " +
      ' AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) ' +
      ' GROUP BY web_url,web_category_id ' +
      'ORDER BY count DESC, web_url asc  LIMIT :limit OFFSET :offset',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          limit,
          offset,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    return getPagingData(results, page, limit);
  }

  async savePrrActivity(prrDto: ActivityCreationAttributes) {
    const user = await this.userService.findOneById(prrDto.userId);
    prrDto.userId = user.id;
    prrDto.userEmail = user.email;
    prrDto.userName = user.firstName;
    prrDto.activityTime = new Date();
    prrDto.orgUnitId = user.orgUnitId;

    if (prrDto.teacherId) {
      const teacher = await this.userService.findOneById(prrDto.teacherId);
      if (teacher) {
        prrDto.teacherName = teacher.firstName + ' ' + teacher.lastName;
      }
    }
    if (!prrDto.webCategoryId) {
      prrDto.webCategoryId = Categories.PERMISSIBLE;
    }
    const account = await this.accountService.findOne(prrDto.accountId);

    if (((Array.isArray(prrDto.prrImages) && prrDto.prrImages.length > 0) || (Array.isArray(prrDto.prrTexts) && prrDto.prrTexts.length > 0)) && prrLevel) {
      const aiData: ActivityAiDataCreationAttributes = {
        webUrl: prrDto.webUrl,
        fullWebUrl: prrDto.fullWebUrl,
        prrImages: prrDto.prrImages,
        prrTexts: prrDto.prrTexts,
        prrTriggerId: prrDto.prrTriggerId,
        prrCategoryId: prrDto.prrCategoryId,
        activityTime: !prrDto.activityTime ? new Date() : prrDto.activityTime,
        falsePositive: false,
        os: prrDto.os,
        extensionVersion: prrDto.extensionVersion,
        mlVersion: prrDto.mlVersion,
        nlpVersion: prrDto.nlpVersion,
        browserVersion: prrDto.browserVersion,
        browser: prrDto.browserVersion,
      };
      await this.activityAiDataService.create(aiData);
    }

    if (account.accountTypeId === AccountTypes.CONSUMER && prrDto.prrLevelId !== PrrLevels.THREE) {
      prrDto.webUrl = '';
      prrDto.fullWebUrl = '';
      prrDto.prrImages = [];
      prrDto.prrTexts = [];
    }
    const activity = await this.create(prrDto);

    // FIXME: we are not storing isAIGenerated field in activity model
    await this.handlePrrLevel3(user, prrDto as PrrActivityDto, activity);
  }

  async findUserLastActivity(userId: string) {
    const response = await this.repository.sequelize.query(
      '' + 'select activity_time from activity where user_id =:userId order by activity_time desc limit 1',
      {
        replacements: {userId},
        type: QueryTypes.SELECT,
        mapToModel: true,
        model: Activity,
      }
    );
    if (response && response.length > 0) {
      return response[0].activityTime;
    }
    return null;
  }

  async generateUniqueUrl(crisesId: string) {
    const baseUrl = process.env.CRISES_RESPONSE_URL ? process.env.CRISES_RESPONSE_URL : process.env.BACKEND_APPLICATION_URL + '/nx/';
    return baseUrl + crisesId;
  }

  async deleteAll(ids: string[]): Promise<void> {
    try {
      await this.repository.destroy({where: {orgUnitId: ids}});
    } catch (e) {
      this.log.error(QueryException.delete(e));
      throw new QueryException(QueryException.delete());
    }
  }

  async searchStudents(offset = 0, limit = this.DEFAULT_PAGE_LIMIT, keyword: string, timezone: string, accountId: string): Promise<PreviewResultDto> {
    if (offset !== 0) {
      offset = offset * this.DEFAULT_PAGE_LIMIT;
    }
    const dataSelect = `SELECT
                             u.last_name     as lastName,
                             u.first_name    as firstName,
                             u.primary_email as email,
                             a.activity_time as interceptionDate,
                             a.web_url       as urlAttempted,
                             a.prr_category_id as category,
                             a.prr_level_id  as prrLevel`;
    const dataQuery = `${dataSelect} ${ActivityService.getFromPart(keyword)} ${ActivityService.getPagination()}`;
    const data = (await this.repository.sequelize.query(dataQuery, ActivityService.getQueryOptions(accountId, offset, limit))) as PrrInfoDto[];
    data.forEach((item: PrrInfoDto) => {
      item.interceptionDate = new Date(item.interceptionDate).toLocaleString('en-US', {timeZone: timezone});
      item.prrLevel = getPrrLevelName(item.prrLevel);
    });

    const countSelect = `SELECT count(*) as count`;
    const countQuery = `${countSelect} ${ActivityService.getFromPart(keyword)} ${ActivityService.getPagination()}`;
    const totalRowsCount = (await this.repository.sequelize.query(countQuery, ActivityService.getQueryOptions(accountId, 0, limit))) as CountResponse[];
    return {
      data,
      totalCount: totalRowsCount[0] ? totalRowsCount[0].count : 0,
    };
  }

  async autocompleteSearch(offset = 0, size = this.DEFAULT_PAGE_LIMIT, keyword: string, accountId: string): Promise<UserInfoDto[]> {
    const dataSelect = `SELECT
                             DISTINCT(u.primary_email) as email,
                             u.last_name     as lastName,
                             u.first_name    as firstName`;
    const dataQuery = `${dataSelect} ${ActivityService.getFromPart(keyword)} ${ActivityService.getPagination()}`;
    return (await this.repository.sequelize.query(dataQuery, ActivityService.getQueryOptions(accountId, offset, size))) as UserInfoDto[];
  }

  private static getQueryOptions(accountId: string, offset: number, limit: number) {
    return {
      replacements: {accountId, offset, limit},
      type: QueryTypes.SELECT,
    };
  }

  private static getFromPart(keyword: string) {
    return `FROM
                activity a
                 INNER JOIN user u  on
                   u.id = a.user_id
                 INNER JOIN category c on
                   c.id = a.prr_category_id
            WHERE
                a.account_id = :accountId
              AND (u.last_name like '%${keyword}%'
              OR u.first_name like '%${keyword}%'
              OR u.primary_email like '%${keyword}%'
              OR concat(u.first_name,' ',u.last_name) like '%${keyword}%' )
            ORDER BY
                u.last_name DESC
                `;
  }

  /** Get All events of Specific Account and convert json into csv format
   * @param  {string} accountId
   * @param  {string} keyword
   * @param  {string} timezone
   * @returns Promise
   */
  async downloadActivity(keyword: string, timezone: string, accountId: string): Promise<Buffer> {
    const dataSelect = `SELECT
                             u.last_name     as lastName,
                             u.first_name    as firstName,
                             u.primary_email as email,
                             a.activity_time as interceptionDate,
                             a.web_url       as urlAttempted,
                             a.prr_category_id as category,
                             a.prr_level_id  as prrLevel`;
    const dataQuery = `${dataSelect} ${ActivityService.getFromPart(keyword)}`;
    const queryOptions = {
      replacements: {accountId},
      type: QueryTypes.SELECT,
    };
    const rows = (await this.repository.sequelize.query(dataQuery, queryOptions)) as PrrInfoDto[];
    if (rows && rows.length > 0) {
      rows.forEach((item: PrrInfoDto) => {
        item.interceptionDate = new Date(item.interceptionDate).toLocaleString('en-US', {timeZone: timezone});
        item.prrLevel = getPrrLevelName(item.prrLevel);
      });
      const json2csvParser = await Json2csvParser.parse(rows).promise()//{header: true});
      return Buffer.from(json2csvParser)
    }
    return;
  }

  private static getPagination() {
    return 'LIMIT :offset, :limit ;';
  }

  async findOneByEventId(eventId: string, userId: string) {
    return this.repository.findOne({where: {eventId, userId}});
  }

  async savePrrActivityInBulk(prrActivityRequest: PrrActivityRequest) {
    const tokenData = prrActivityRequest.token;
    const prrDTOs = prrActivityRequest.activities;

    for (const prrDto of prrDTOs) {
      prrDto.accountId = tokenData.accountId;
      prrDto.userDeviceLinkId = tokenData.userDeviceLinkId;
      prrDto.deviceId = tokenData.deviceId;
      prrDto.userId = tokenData.userId;

      if (!prrDto.webCategoryId) {
        prrDto.webCategoryId = Categories.PERMISSIBLE;
      }

      // FIXME: as ActivityCreationAttributes should be removed, eventId is required field in models
      await this.savePrrActivity(prrDto as ActivityCreationAttributes).catch((e) => {
        this.log.error(`Failed to save activity. ${e}`);
        throw e;
      });
    }
  }

  async handlePrrLevel3(user: User, prrDto: PrrActivityDto, activity: Activity): Promise<void> {
    if (prrDto.isAIGenerated) {
      return;
    }
    const account = await this.accountService.findOne(prrDto.accountId);
    const crisesId = uuid().replace(/-/g, '');
    const url = await this.generateUniqueUrl(crisesId);
    if (prrDto.prrLevelId === PrrLevels.THREE) {
      if (account.accountTypeId === AccountTypes.SCHOOL) {
        const crisesManagementDto = {
          id: crisesId,
          activityId: activity.id,
          url: url,
          contact: account.emergencyContactName,
          phoneNumber: account.emergencyContactPhone,
          accountId: account.id,
        } as CreatePrrNotificationDto;
        try {
          await this.crisesManagementService.createNotification(crisesManagementDto);
        } catch (e) {
          this.log.error('An error occurred while saving notification', e);
        }
      } else if (account.accountTypeId === AccountTypes.CONSUMER) {
        const parent = await this.userService.findParentAccount(user.accountId);
        await this.emailService.sendEmail({
          id: uuid(),
          meta: {
            kidName: `${user.firstName} ${user.lastName}`,
            category: prrDto.prrCategoryId.replace(/_/g, ' '),
            url: prrDto.fullWebUrl,
          },
          to: parent.email,
          content: {
            templateName: EmailTemplates.INFORM_LEVEL_THREE_URL,
          },
        });
      }
    }
    return;
  }

  async sendMessage(message: PrrActivityRequest) {
    this.log.debug('ActivityService sending activities event', message);

    try {
      const result = await retry(
        async (bail) => {
          try {
            const job = await this.queue.createJob(message);
            job.save();
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('AWS Activity Service OnRetry - retrying queue email due to', error);
          },
        }
      );
      return result;
    } catch (error) {
      this.log.error('AWS Activity Service. Unable to send message to queue', error);
    }
  }

  async findAllPrrLevelsCount(userId: string, start: Date, end: Date) {
    const query =
      'SELECT COUNT(*) AS counts, l.id AS level ' +
      'FROM activity a ' +
      'INNER JOIN prr_level l ON l.id = a.prr_level_id ' +
      'WHERE a.user_id = :userId ' +
      'AND DATE(activity_time) BETWEEN DATE(:start) AND DATE(:end) ' +
      'GROUP BY prr_level_id ' +
      'ORDER BY prr_level_id ASC';

    const res = await this.repository.sequelize.query(query, {
      replacements: {userId, start, end},
      type: QueryTypes.SELECT,
      mapToModel: true,
    });

    return {
      casual: this.getCounts(res, PrrLevels.ONE),
      coached: this.getCounts(res, PrrLevels.TWO),
      crisis: this.getCounts(res, PrrLevels.THREE),
    };
  }

  private getCounts(res: any, level: PrrLevels) {
    const obj = res.find((o) => o.level === level);
    return obj ? obj.counts : 0;
  }

  async listener(): Promise<void> {

    this.queue.process(async (message, done) => {
      this.log.debug(`received inform event`);
      const request = JSON.parse(message.Body);
      const prrActivityRequest: PrrActivityRequest = request as PrrActivityRequest;
      this.log.debug('Bee queue received inform event', {prrActivityRequest});
      await this.savePrrActivityInBulk(prrActivityRequest);
      return done(null, null);
    });

    this.queue.on('error', (err) => {
      this.log.error('BeeQueue Parent Email Queue listen error', err);
    });

    this.queue.on('succeeded', (job, result) => {
      this.log.info('BeeQueue Parent Email Queue success: ', result);
    });
    const success = await this.queue.connect();
    if (success) {
      this.log.info(`A listener called ${this.queueConfig.name} is setup for queue `, this.queueConfig.url);
    } else {
      this.log.error(`A listener called ${this.queueConfig.name} did not setup for queue `, this.queueConfig.url);
    }
  }
}
