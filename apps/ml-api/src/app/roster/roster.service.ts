import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RosterTokenDto } from './dto/roster.dto';
import { Cron } from '@nestjs/schedule';
import { LoggingService } from '../logger/logging.service';
import { ApiKeyService } from '../api-key/api-key.service';
import { ServiceTypes } from '../api-key/service.types';
import { ServicesApiKey } from '../api-key/entities/api-key.entity';
import { ApiKeysDto } from './dto/api.keys.dto';
import { RosterOrgService } from '../roster-org/roster-org.service';
import { SchoolClassService } from '../school-class/school-class.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { QueryException } from '../error/common.exception';
import { RosterApiErrors } from './roster-apis.errors';
import { RosterOrg } from '../roster-org/entities/roster-org.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { SchoolClass } from '../school-class/entities/school-class.entity';

@Injectable()
export class OneRosterService {
    private readonly BASE_URL: string;
    private readonly LIMIT: number;
    constructor(
        private readonly log: LoggingService,
        private readonly apiKeyService: ApiKeyService,
        private readonly rosterOrgService: RosterOrgService,
        private readonly schoolClassService: SchoolClassService,
        private readonly enrollmentService: EnrollmentService,
        private readonly userService: UserService
    ) {
        this.BASE_URL = '/ims/oneroster/v1p1/';
        this.LIMIT = 5000;
    }

    async getAccessToken(apiKeysDTO: ApiKeysDto): Promise<RosterTokenDto> {
        try {
            const credential = Buffer.from(`${apiKeysDTO.accessKey}:${apiKeysDTO.secret}`).toString('base64');
            const resp = await axios.post<RosterTokenDto>(`${apiKeysDTO.hostUrl}/token`, null, {
                headers: {
                    Authorization: `Basic ${credential}`,
                },
            });
            return resp.data;
        } catch (error) {
            this.log.error(RosterApiErrors.accessToken(), error);
            throw new QueryException(RosterApiErrors.accessToken());
        }
    }

    async fetchUsers(access_token: string, hostUrl: string): Promise<any[]> {
        try {
            let allUsers = [];
            for (let i = 0; i < 50000; i += this.LIMIT) {
                const resp = await axios.get(`${hostUrl}${this.BASE_URL}users?limit=${this.LIMIT}&offset=${i}`, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (resp.data?.users?.length > 0) {
                    allUsers = allUsers.concat(resp.data.users);
                    continue;
                }
                break;
            }
            if (allUsers.length > 0) {
                return allUsers.map((user) => {
                    return {
                        username: user.username,
                        enabledUser: user.enabledUser,
                        givenName: user.givenName,
                        familyName: user.familyName,
                        middleName: user.middleName,
                        role: user.role,
                        identifier: user.identifier,
                        email: user.email,
                        sms: user.sms,
                        phone: user.phone,
                        orgs: user.orgs.map((org) => org.sourcedId),
                        grades: user.grades,
                        sourcedId: user.sourcedId,
                        status: user.status,
                        dateLastModified: user.dateLastModified,
                    };
                });
            }
            return [];
        } catch (error) {
            this.log.error(RosterApiErrors.fetchUsers(), error);
            throw new QueryException(RosterApiErrors.fetchUsers());
        }
    }

    async fetchOrgUnits(access_token: string, hostUrl: string): Promise<any[]> {
        try {
            let allOrgUnits = [];
            for (let i = 0; i < 50000; i += this.LIMIT) {
                const resp = await axios.get(`${hostUrl}${this.BASE_URL}orgs?limit=${this.LIMIT}&offset=${i}`, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (resp.data?.orgs?.length > 0) {
                    allOrgUnits = allOrgUnits.concat(resp.data.orgs);
                    continue;
                }
                break;
            }
            if (allOrgUnits.length > 0) {
                return allOrgUnits.map((org) => {
                    return {
                        id: org.sourcedId,
                        name: org.name,
                        type: org.type,
                        identifier: org.identifier,
                        parent: org.parent,
                        rosterStatus: org.status,
                        dateLastModified: org.dateLastModified,
                    };
                });
            }
            return [];
        } catch (error) {
            this.log.error(RosterApiErrors.fetchUnits(), error);
            throw new QueryException(RosterApiErrors.fetchUnits());
        }
    }

    async fetchEnrollments(access_token: string, hostUrl: string): Promise<any[]> {
        try {
            let allEnrollments = [];
            for (let i = 0; i < 50000; i += this.LIMIT) {
                const resp = await axios.get(`${hostUrl}${this.BASE_URL}enrollments?limit=${this.LIMIT}&offset=${i}`, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (resp.data?.enrollments?.length > 0) {
                    allEnrollments = allEnrollments.concat(resp.data.enrollments);
                    continue;
                }
                break;
            }
            if (allEnrollments.length > 0) {
                return allEnrollments.map((enrollment) => {
                    return {
                        id: enrollment.sourcedId,
                        userSourcedId: enrollment.user.sourcedId,
                        classId: enrollment.class.sourcedId,
                        schoolId: enrollment.school.sourcedId,
                        role: enrollment.role,
                        primary: enrollment.primary,
                        beginDate: enrollment.beginDate,
                        endDate: enrollment.endDate,
                        status: enrollment.status,
                        dateLastModified: enrollment.dateLastModified,
                    };
                });
            }
            return [];
        } catch (error) {
            this.log.error(RosterApiErrors.fetchEnrollments(), error);
            throw new QueryException(RosterApiErrors.fetchEnrollments());
        }
    }

    async fetchClasses(access_token: string, hostUrl: string): Promise<any[]> {
        try {
            let allClasses = [];
            for (let i = 0; i < 50000; i += this.LIMIT) {
                const resp = await axios.get(`${hostUrl}${this.BASE_URL}classes?limit=${this.LIMIT}&offset=${i}`, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (resp.data?.classes?.length > 0) {
                    allClasses = allClasses.concat(resp.data.classes);
                    continue;
                }
                break;
            }
            if (allClasses.length > 0) {
                return allClasses.map((cls) => {
                    return {
                        id: cls.sourcedId,
                        title: cls.title,
                        classType: cls.classType,
                        location: cls.location,
                        grades: cls.grades,
                        schoolId: cls.school.sourcedId,
                        status: cls.status,
                        dateLastModified: cls.dateLastModified,
                    };
                });
            }
            return [];
        } catch (error) {
            this.log.error(RosterApiErrors.fetchClasses(), error);
            throw new QueryException(RosterApiErrors.fetchClasses());
        }
    }

    @Cron('0 0 * * *')
    async rosterJob(): Promise<void> {
        const servicesApiKeys = await this.apiKeyService.findAllByService(ServiceTypes.ONE_ROSTER);
        for (const serviceKey of servicesApiKeys) {
            const apiKeys = OneRosterService.buildApiKeyDTO(serviceKey);
            await this.syncSIS(apiKeys, serviceKey.accountId);
        }
    }

    async syncSIS(apiKeys: ApiKeysDto, accountId: string): Promise<void> {
        const { access_token } = await this.getAccessToken(apiKeys);
        const hostUrl = apiKeys.hostUrl;

        await this.syncUnits(access_token, hostUrl, accountId);
        await this.syncUsers(access_token, hostUrl, accountId);
        await this.syncClasses(access_token, hostUrl, accountId);
        await this.syncEnrollments(access_token, hostUrl, accountId);
    }

    private async syncEnrollments(access_token: string, hostUrl: string, accountId: string) {
        const allApiEnrollments = await this.fetchEnrollments(access_token, hostUrl);
        allApiEnrollments.forEach((enrol) => (enrol.accountId = accountId));
        const dbEnrollments = await this.enrollmentService.findAllByAccountId(accountId);
        if (allApiEnrollments.length > this.LIMIT) {
            for (let i = 0; i < allApiEnrollments.length; i += this.LIMIT) {
                await this.enrollmentService.bulkUpsert(allApiEnrollments.slice(i, i + this.LIMIT));
            }
        } else {
            await this.enrollmentService.bulkUpsert(allApiEnrollments);
        }
        await this.deleteEnrollments(allApiEnrollments, dbEnrollments);
    }
    private async deleteEnrollments(apiEnrollments: any[], dbEnrollment: Enrollment[]) {
        const dbEnrollmentIds = apiEnrollments.map((enrol) => enrol.id);
        const enrollmentsToDelete = dbEnrollment.filter((dbEnrol) => !dbEnrollmentIds.includes(dbEnrol.id)).map((dbEnrol) => dbEnrol.id);

        if (enrollmentsToDelete.length > 0) {
            try {
                await this.enrollmentService.deleteAll(enrollmentsToDelete);
            } catch (e) {
                this.log.error(QueryException.delete(e));
                throw new QueryException(QueryException.delete());
            }
        }
    }

    private async syncClasses(access_token: string, hostUrl: string, accountId: string) {
        const allApiClasses = await this.fetchClasses(access_token, hostUrl);
        allApiClasses.forEach((clas) => (clas.accountId = accountId));
        const schoolClasses = await this.schoolClassService.findAllByAccountId(accountId);
        if (allApiClasses.length > this.LIMIT) {
            for (let i = 0; i < allApiClasses.length; i += this.LIMIT) {
                await this.schoolClassService.bulkUpsert(allApiClasses.slice(i, i + this.LIMIT));
            }
        } else {
            await this.schoolClassService.bulkUpsert(allApiClasses);
        }
        await this.deleteClasses(allApiClasses, schoolClasses);
    }
    private async deleteClasses(apiClasses: any[], dbClasses: SchoolClass[]) {
        const apiClassIds = apiClasses.map((apiClass) => apiClass.id);
        const classesToDelete = dbClasses.filter((dbClass) => !apiClassIds.includes(dbClass.id)).map((dbClass) => dbClass.id);

        if (classesToDelete.length > 0) {
            try {
                await this.schoolClassService.deleteAll(classesToDelete);
            } catch (e) {
                this.log.error(QueryException.delete(e));
                throw new QueryException(QueryException.delete());
            }
        }
    }

    static buildApiKeyDTO(serviceKey: ServicesApiKey): ApiKeysDto {
        return {
            accessKey: serviceKey.accessKey,
            secret: serviceKey.secret,
            hostUrl: serviceKey.hostUrl,
        } as ApiKeysDto;
    }

    private async syncUsers(access_token: string, hostUrl: string, accountId: string) {
        const allApiUsers = await this.fetchUsers(access_token, hostUrl);
        allApiUsers.forEach((user) => (user.accountId = accountId));
        const dbUsers = await this.userService.findAllByAccountId(accountId);
        if (allApiUsers.length > this.LIMIT) {
            for (let i = 0; i < allApiUsers.length; i += this.LIMIT) {
                await this.addUsers(allApiUsers.slice(i, i + this.LIMIT), dbUsers);
                await this.updateUsers(allApiUsers.slice(i, i + this.LIMIT), dbUsers);
            }
        } else {
            await this.addUsers(allApiUsers, dbUsers);
            await this.updateUsers(allApiUsers, dbUsers);
        }
    }
    private async addUsers(apiUsers: any[], dbUsers: User[]) {
        const dbUserEmails = dbUsers.map((user) => user.email);
        const usersToAdd = apiUsers
            .filter((apiUser) => !dbUserEmails.includes(apiUser.email))
            .map((apiUser) => {
                apiUser.id = uuidv4().replace(/-/g, '');
                return apiUser;
            });
        if (usersToAdd.length > 0) {
            try {
                await this.userService.bulkCreate(usersToAdd);
            } catch (e) {
                this.log.error(QueryException.save(e));
                throw new QueryException(QueryException.save());
            }
        }
    }
    private async updateUsers(apiUsers: any[], dbUsers: User[]) {
        const dbUserEmails = dbUsers.map((user) => user.email);
        const toUpdate = apiUsers.filter((inputUser) => dbUserEmails.includes(inputUser.email));
        try {
            for (const user of toUpdate) {
                delete user.role;
                await this.userService.findOneAndUpdate(user.email, user);
            }
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    private async syncUnits(access_token: string, hostUrl: string, accountId: string) {
        const allApiUnits = await this.fetchOrgUnits(access_token, hostUrl);
        allApiUnits.forEach((unit) => (unit.accountId = accountId));
        const dbUnits = await this.rosterOrgService.findAllByAccountId(accountId);
        if (allApiUnits.length > this.LIMIT) {
            for (let i = 0; i < allApiUnits.length; i += this.LIMIT) {
                await this.rosterOrgService.bulkUpsert(allApiUnits.slice(i, i + this.LIMIT));
            }
        } else {
            await this.rosterOrgService.bulkUpsert(allApiUnits);
        }
        await this.deleteUnits(allApiUnits, dbUnits);
    }
    private async deleteUnits(apiUnits: any[], dbUnits: RosterOrg[]) {
        const apiUnitIds = apiUnits.map((unit) => unit.id);
        const unitsToDelete = dbUnits.filter((unit) => !apiUnitIds.includes(unit.id)).map((unit) => unit.id);

        if (unitsToDelete.length > 0) {
            try {
                await this.rosterOrgService.deleteAll(unitsToDelete);
            } catch (e) {
                this.log.error(QueryException.delete(e));
                throw new QueryException(QueryException.delete());
            }
        }
    }
}
