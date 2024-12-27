import { Injectable, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleApiOrgUnitDto } from './dto/google-api-org-unit.dto';
import { GoogleApisErrors } from './google-apis.errors';
import { QueryException } from '../error/common.exception';
import { ConfigService} from '@nestjs/config';
import { LoggingService } from '../logger/logging.service';
import { AuthToken } from '../auth-token/entities/auth-token.entity';
import { CreateOrgUnitDto } from '../org-unit/dto/create-org-unit.dto';
import {GoogleApiConfig} from "../config/google.apis";

@Injectable()
export class GoogleApiService {
    private readonly client_id: string;
    private readonly client_secret: string;

    constructor(private readonly configService: ConfigService, private readonly log: LoggingService) {
        this.log.className(GoogleApiService.name);
        const config = configService.get<GoogleApiConfig>('googleApiConfig');
        this.client_id = config.client_id;
        this.client_secret = config.client_secret;
    }

    async getOAuth2Client(tokenInfo: AuthToken) {
        const oauth2Client = new google.auth.OAuth2(this.client_id, this.client_secret);
        oauth2Client.credentials = { access_token: tokenInfo.accessToken };

        try {
            await oauth2Client.getTokenInfo(tokenInfo.accessToken);
        } catch (e) {
            this.log.debug('Access token was not valid, regenerating using refresh token...');
            const access_token = await this.getNewToken(tokenInfo);
            oauth2Client.credentials = { access_token };
        }
        return oauth2Client;
    }

    async getNewToken(tokenInfo: AuthToken) {
        const oauth2Client = new google.auth.OAuth2(this.client_id, this.client_secret);
        oauth2Client.setCredentials({ refresh_token: tokenInfo.refreshToken });
        try {
            const res = await oauth2Client.getAccessToken();
            return res.token;
        } catch (e) {
            this.log.error(GoogleApisErrors.accessToken(), e);
            throw e;
        }
    }

    /** Get all users
     * @param tokenInfo
     * @returns users
     */
    async fetchUsers(tokenInfo: AuthToken) {
        const auth = await this.getOAuth2Client(tokenInfo);
        const service = google.admin({ version: 'directory_v1', auth });
        try {
            let users = [];
            const params = { customer: 'my_customer', maxResults: 500 };
            let userResponse;
            let nextPageToken = '';
            do {
                if (nextPageToken && nextPageToken !== '') {
                    params['pageToken'] = nextPageToken;
                }
                userResponse = await service.users.list(params);
                nextPageToken = userResponse.data.nextPageToken;
                users = users.concat(userResponse.data.users);
            } while (nextPageToken);
            return users;
        } catch (e) {
            this.log.error(GoogleApisErrors.fetchUsers(), e);
            throw e;
        }
    }

    /** Get single user to test if token is valid
     * @param tokenInfo
     * @returns users
     */
    async fetchOneUser(tokenInfo: AuthToken) {
        const auth = await this.getOAuth2Client(tokenInfo);
        const service = google.admin({ version: 'directory_v1', auth });
        try {
            const {
                data: { users },
            } = await service.users.list({ customer: 'my_customer', maxResults: 1 });
            return users && users.length > 0 ? users : [];
        } catch (e) {
            throw e;
        }
    }

    /** Get user
     * @param  email user email
     * @param tokenInfo token info
     * @returns user
     */
    async getUser(email: string, tokenInfo: any) {
        const auth = await this.getOAuth2Client(tokenInfo);
        const service = google.admin({ version: 'directory_v1', auth });
        try {
            const {
                data: { users },
            } = await service.users.list({ customer: 'my_customer', query: `email=${email}` });
            return users && users.length > 0 ? users[0] : null;
        } catch (e) {
            this.log.error(GoogleApisErrors.fetchUser(email), e);
            throw new QueryException(GoogleApisErrors.fetchUser(email));
        }
    }

    /** Get organizational units
     * @returns organizational units
     */
    async fetchOrgUnits(tokenInfo: AuthToken): Promise<CreateOrgUnitDto[]> {
        const auth = await this.getOAuth2Client(tokenInfo);
        const service = google.admin({ version: 'directory_v1', auth });
        const filter = {
            customerId: 'my_customer',
            orgUnitPath: '/',
            type: 'ALL',
        };
        try {
            const res = await service.orgunits.list(filter);
            const organizationUnits = res.data.organizationUnits;
            if (organizationUnits && organizationUnits.length > 0) {
                const finalUnits = organizationUnits.map((o) => {
                    return {
                        name: o.name,
                        googleOrgUnitId: o.orgUnitId,
                        parentOuId: o.parentOrgUnitId,
                        description: o.description,
                        parent: o.parentOrgUnitPath,
                        orgUnitPath: o.orgUnitPath,
                    } as CreateOrgUnitDto;
                });

                const foundOU = organizationUnits.find((ou) => ou.parentOrgUnitPath === '/');
                const root = await service.orgunits.get({
                    customerId: 'my_customer',
                    orgUnitPath: foundOU.parentOrgUnitId,
                });

                const rootUnit = {
                    name: root.data.name,
                    googleOrgUnitId: root.data.orgUnitId,
                    parentOuId: root.data.parentOrgUnitId,
                    description: root.data.description,
                    parent: root.data.parentOrgUnitPath,
                    orgUnitPath: root.data.orgUnitPath,
                } as CreateOrgUnitDto;
                finalUnits.push(rootUnit);
                return finalUnits;
            } else {
                this.log.debug('No organizational units found.');
                return [];
            }
        } catch (e) {
            this.log.error(GoogleApisErrors.fetchUnits(), e);
            throw new QueryException(GoogleApisErrors.fetchUnits());
        }
    }
}
