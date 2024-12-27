import sequelize from 'sequelize';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { KID_REQUEST_REPOSITORY, SEQUELIZE, USER_REPOSITORY } from '../constants';
import { QueryException, ValidationException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { KidAccessRequestsDto, KidRequestDto, KidRequestTypes } from './domain/kid-request-dto';
import { v4 as uuid } from 'uuid';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { FilteredUrlCreationAttributes } from '../filtered-url/entities/filtered-url.entity'
import { JwtTokenService } from '../auth/jwtToken/jwt.token.service';
import { getSimpleURL } from '../utils/http.util';
import { KidRequest } from './domain/kid-request.entity';
import { FilteredUrlErrors } from '../filtered-url/filtered-url.errors';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { UserErrors } from '../consumer/user/users.errors';
import {DateUtils} from "../utils/dateUtils"

@Injectable()
export class KidRequestService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(KID_REQUEST_REPOSITORY)
        private readonly repository: typeof KidRequest,
        private readonly log: LoggingService,
        private readonly filteredUrlService: FilteredUrlService,
        private readonly jwtTokenService: JwtTokenService,
        @Inject(SEQUELIZE) sequelize: Sequelize,
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User
    ) {
        this.log.className(KidRequestService.name);
        this.sequelize = sequelize;
    }

    /**
     * Create kid request
     * @param dto
     * @returns KidRequest
     */
    async create(dto: KidRequestDto): Promise<KidRequest> {
        try {
            return await this.repository.create(dto);
        } catch (error) {
            this.log.error(QueryException.save(error));
            throw new QueryException(QueryException.save());
        }
    }

    /**
     * Find ask requests
     * @param kidId
     * @returns KidRequest[]
     */
    async findAskRequests(kidId: string): Promise<KidRequest[]> {
        return await this.repository.findAll({
            attributes: [[sequelize.literal('DISTINCT url'), 'url'], 'kidId', 'updatedAt'],
            where: {
                kidId,
                type: KidRequestTypes.ASK,
                accessGranted: false,
                updatedAt: {
                    [Op.gt]: DateUtils.addDays(new Date(), -2),
                },
            },
        });
    }

    /**
     * Find by category id and filtered url
     * @param url
     * @param kidId
     * @returns boolean
     */
    async findOne(url: string, kidId: string): Promise<KidRequest[]> {
        url = `%${url}%`;
        const query = `select fu.id, fu.access_granted from kid_request fu where fu.kid_id = :kidId and fu.url LIKE :url and fu.access_granted = false`;
        return await this.repository.sequelize.query(query, {
            replacements: { url, kidId },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: KidRequest,
        });
    }

    /**
     * Update
     * @param token
     * @param accountId
     * @returns void
     */
    async update(accountId: string, token: string): Promise<{ message: string }> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const payload = await this.jwtTokenService.verifyToken(token);
            const url = getSimpleURL(payload.url);
            const message = {
                message: `Website added to allowed websites list <${url}>`,
                orgUnitId: payload.orgUnitId,
            };
            const enabled = true;
            const orgUnitId = payload.orgUnitId;
            const obj : FilteredUrlCreationAttributes = { id: uuid(), url, orgUnitId, accountId, enabled, inheritFromParent: true };

            const urlExists = await this.filteredUrlService.findOne(orgUnitId, url);
            if (urlExists && urlExists.length > 0 && urlExists[0].enabled) {
                await this.updateAccessGranted(payload.kidId, url, true);
                throw new ValidationException(FilteredUrlErrors.alreadyExists(url), HttpStatus.CONFLICT);
            }
            if (urlExists && urlExists.length > 0 && !urlExists[0].enabled) {
                await this.updateAccessGranted(payload.kidId, url, true);
                await this.filteredUrlService.update(urlExists[0].id, { enabled });
                await transaction.commit();
                return message;
            }
            await this.filteredUrlService.create(obj);
            await this.updateAccessGranted(payload.kidId, url, true);
            await transaction.commit();
            return message;
        } catch (error) {
            await transaction.rollback();
            if (error?.status === HttpStatus.CONFLICT) {
                throw error;
            }
            this.log.error(QueryException.update(error));
            throw new QueryException(QueryException.update());
        }
    }

    /**
     * Clear access limit
     * @param token
     * @returns void
     */
    async clearAccessLimit(token: string): Promise<{ message: string }> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const payload = await this.jwtTokenService.verifyToken(token);
            const kid = await this.userRepository.findOne<User>({ where: { id: payload.userId } });
            if (!kid) {
                throw new ValidationException(UserErrors.notFound(payload.userId), HttpStatus.BAD_REQUEST);
            }
            if (!kid.accessLimited) {
                throw new ValidationException(UserErrors.accessLimitAlreadyCleared(`${kid.firstName} ${kid.lastName}`), HttpStatus.CONFLICT);
            }
            await this.userRepository.update({ accessLimited: false }, { where: { id: payload.userId } });
            return { message: `The access limit for ${kid.firstName} ${kid.lastName} has been cleared` };
        } catch (error) {
            await transaction.rollback();
            if (error?.status === HttpStatus.CONFLICT || error?.status === HttpStatus.BAD_REQUEST) {
                throw error;
            }
            this.log.error(QueryException.update(error));
            throw new QueryException(QueryException.update());
        }
    }

    /**
     * Update access granted
     * @param url
     * @param accessGranted
     * @returns void
     */
    async updateAccessGranted(kidId: string, url: string, accessGranted: boolean): Promise<void> {
        await this.repository.update({ accessGranted }, { where: { kidId, url } });
    }

    /**
     * Update date
     * @param id
     * @returns void
     */
    async updateDate(id: string, requestTime?: Date): Promise<void> {
        if (!requestTime) {
            requestTime = new Date();
        }
        await this.repository.update({ updatedAt: new Date(), requestTime }, { where: { id } });
    }

    /**
     * Delete kid request by kid ids
     * @param kidIds
     * @returns void
     */
    async deleteByKidIds(kidIds: string[]): Promise<void> {
        try {
            await this.repository.destroy({ where: { kidId: kidIds } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * Update access requests
     * @param accountId
     * @param accessRequests
     * @returns KidRequest
     */
    async updateAccessRequests(accountId: string, accessRequests: KidAccessRequestsDto): Promise<KidRequestDto[]> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const kid = await this.userRepository.findOne<User>({
                attributes: ['orgUnitId'],
                where: { id: accessRequests.kidId },
            });
            const orgUnitId = kid.orgUnitId;
            for (const requestUrl of accessRequests.requests) {
                const urlExists = await this.filteredUrlService.findOne(orgUnitId, requestUrl);
                if (urlExists && urlExists.length > 0 && urlExists[0].enabled) {
                    await this.updateAccessGranted(accessRequests.kidId, requestUrl, true);
                    continue;
                }
                const enabled = true;
                if (urlExists && urlExists.length > 0 && !urlExists[0].enabled) {
                    await this.updateAccessGranted(accessRequests.kidId, requestUrl, true);
                    await this.filteredUrlService.update(urlExists[0].id, { enabled });
                    continue;
                }
                const filteredUrlPayload : FilteredUrlCreationAttributes = { id: uuid(), url: requestUrl, orgUnitId, accountId, enabled, inheritFromParent: true };
                await this.filteredUrlService.create(filteredUrlPayload);
                await this.updateAccessGranted(accessRequests.kidId, requestUrl, true);
            }
            await transaction.commit();

            return await this.findAskRequests(accessRequests.kidId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * find All urls by user device link for given time
     * @param userDeviceLinkId
     * @param interval interval in minutes
     */
    async findAllByUserDeviceId(userDeviceLinkId: string, interval: number) {
        const current = new Date();
        const timeLimit = new Date(
            current.getUTCFullYear(),
            current.getUTCMonth(),
            current.getUTCDate(),
            current.getUTCHours(),
            current.getUTCMinutes(),
            current.getUTCSeconds(),
            current.getUTCMilliseconds()
        );
        timeLimit.setMinutes(current.getMinutes() - interval);

        const results = await this.repository.sequelize.query(
            'SELECT distinct kid_request.url as url,kid_request.type as type ' +
                ' FROM kid_request ' +
                ' INNER JOIN `user_device_link` ON user_device_link.id = kid_request.user_device_link_id ' +
                ' WHERE (request_time >= :timeLimit or updatedAt >= :timeLimit)  and kid_request.user_device_link_id = :userDeviceLinkId ',
            {
                replacements: {
                    timeLimit: timeLimit,
                    userDeviceLinkId,
                },
                type: QueryTypes.SELECT,
                mapToModel: true,
                model: KidRequest,
            }
        );
        const result = results.reduce(function (r, a) {
            r[a.type] = r[a.type] || [];
            r[a.type].push(a.url);
            return r;
        }, Object.create(null));
        return result;
    }
}
