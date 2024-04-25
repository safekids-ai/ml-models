import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {google} from 'googleapis';
import {JwtTokenService} from '../auth/jwtToken/jwt.token.service';
import {LoggingService} from '../logger/logging.service';
import {CreateAccountDto} from '../accounts/dto/create-account.dto';
import {UserAttributes} from '../user/entities/user.entity';
import {CreateOrgUnitDto} from '../org-unit/dto/create-org-unit.dto';
import {AccountService} from '../accounts/account.service';
import {OrgUnitService} from '../org-unit/org-unit.service';
import {UserService} from '../user/user.service';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {ConfigService} from '@nestjs/config';
import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE} from '../constants';
import {adminScopes, teacherScopes} from './dto/google.api.scopes';
import {DirectoryService} from '../directory-service/directory.service';
import {GoogleOauthTokenDto} from './dto/google.oauth.token.dto';
import {QueryException, ValidationException} from '../error/common.exception';
import {UserRoles} from '../user/user.roles';
import {Cron} from '@nestjs/schedule';
import {AccountErrors} from '../accounts/account.errors';
import {GoogleApisErrors} from '../google-apis/google-apis.errors';
import {Credentials} from 'google-auth-library/build/src/auth/credentials';
import {Statuses} from '../status/default-status';
import {AccountTypes} from '../account-type/dto/account-types';
import {LoginTokenResponseDto} from '../auth/dto/login-token-response.dto';
import {OAuth2Client} from 'google-auth-library';
import {AuthTokenCreationAttributes} from '../auth-token/entities/auth-token.entity';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";
import {QueueConfig} from "apps/ml-api/src/app/config/queue";
import {GoogleApiConfig} from "apps/ml-api/src/app/config/google.apis";

@Injectable()
export class GoogleOauthService {
  private readonly WEB_URL: string;
  private readonly client_id: string;
  private readonly client_secret: string;
  private readonly sequelize: Sequelize;

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly accountService: AccountService,
    private readonly orgUnitService: OrgUnitService,
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
    private readonly directoryService: DirectoryService,
    private readonly log: LoggingService,
    private readonly config: ConfigService,
    @Inject(SEQUELIZE) sequelize: Sequelize
  ) {
    const googleConfig = this.config.get<GoogleApiConfig>('googleApiConfig')
    this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
    this.sequelize = sequelize;
    this.client_id = googleConfig.client_id;
    this.client_secret = googleConfig.client_secret;
  }

  async authorize(res, isTeacher: boolean, isRefreshTokenExpired = true) {
    const scopes = isTeacher ? teacherScopes : adminScopes;
    const uri = isTeacher ? `${this.WEB_URL}/auth/google/redirect/teacher` : `${this.WEB_URL}/auth/google/redirect`;

    const oauthClient = this.getOauthClient(uri);
    const authorizeUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
      ...(isRefreshTokenExpired ? {prompt: 'consent'} : {}),
    });
    res.redirect(authorizeUrl);
  }

  private getOauthClient(redirectUri: string) {
    return new google.auth.OAuth2(this.client_id, this.client_secret, redirectUri);
  }

  async authenticateAdmin(code: string): Promise<LoginTokenResponseDto> {
    const adminUri = `${this.WEB_URL}/auth/google/redirect`;
    const oauthClient = this.getOauthClient(adminUri);
    const tokens = await this.getTokenCredentials(code, oauthClient);
    oauthClient.setCredentials(tokens);
    const user = await this.getUserInfo(oauthClient);
    try {
      this.log.debug('User profile fetched from google apis', user);
      const root = await this.getRootOrgUnits(oauthClient);

      let transaction;
      try {
        transaction = await this.sequelize.transaction();
        const accountDTO = {
          name: root.name,
          primaryDomain: user.hd,
          accountTypeId: AccountTypes.SCHOOL,
        } as CreateAccountDto;
        const account = await this.accountService.upsertByDomain(accountDTO);
        const accountId = account.id;

        const orgUnitDTO = {
          name: root.name,
          googleOrgUnitId: root.orgUnitId,
          parent: root.parentOrgUnitPath,
          parentOuId: root.parentOrgUnitId,
          description: root.description,
          accountId: accountId,
          orgUnitPath: root.orgUnitPath,
        } as CreateOrgUnitDto;

        const orgUnit = await this.orgUnitService.upsert(orgUnitDTO);

        const userData = await this.userService.findOneByEmail(user.email);
        const userDTO: UserAttributes = {
          firstName: user.given_name,
          lastName: user.family_name,
          email: user.email,
          accountId: accountId,
          orgUnitId: orgUnit.id,
          thumbnailPhotoUrl: user.picture,
          isAdmin: 1,
          role: UserRoles.ADMINISTRATOR,
          statusId: Statuses.ACTIVE,
          accessCode: userData.accessCode,
          accessLimited: userData.accessLimited,
          password: userData.password
        };
        const dbUser = await this.userService.upsert(userDTO);
        const userId = dbUser.id;

        const authTokenDTO: AuthTokenCreationAttributes = {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(tokens.expiry_date),
          userId: userId,
        };
        await this.authTokenService.upsert(authTokenDTO);

        try {
          await this.directoryService.populateOrgUnits(accountId, userId);
          await transaction.commit();
        } catch (e) {
          this.log.error(e);
          await transaction.rollback();
          throw e;
        }
        return await this.generateToken(userId, accountId);
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    } catch (err) {
      if (err?.status === 400) {
        this.log.info(err);
        throw err;
      }
      if (err?.status === 403) {
        this.log.info(err);
        throw err;
      }
      if (err?.status >= 401 && err?.status <= 499) {
        this.log.info(err);
        throw new UnauthorizedException();
      }
      this.log.info(QueryException.save(err));
      throw new QueryException(QueryException.save());
    }
  }

  async getTokenCredentials(code: string, oauthClient: OAuth2Client): Promise<Credentials> {
    try {
      const {tokens} = await oauthClient.getToken(code);
      return tokens;
    } catch (e) {
      this.log.error('An error occurred when fetching tokens by code', e);
      throw new InternalServerErrorException('An error occurred when fetching tokens by code');
    }
  }

  private async generateToken(userId: string, accountId: string) {
    const payload = {
      userId: userId,
      accountId: accountId,
    } as GoogleOauthTokenDto;

    const jwt_token = await this.jwtTokenService.generateRegistrationToken(payload);
    return {jwt_token} as LoginTokenResponseDto;
  }

  async authenticateTeacher(code: string): Promise<LoginTokenResponseDto> {
    const teacherUri = `${this.WEB_URL}/auth/google/redirect/teacher`;
    const oauthClient = this.getOauthClient(teacherUri);
    const tokens = await this.getTokenCredentials(code, oauthClient);
    oauthClient.setCredentials(tokens);
    const userInfo = await this.getUserInfo(oauthClient);
    this.log.debug('User profile fetched from google apis', userInfo);
    const account = await this.accountService.findAdminAccount(userInfo.hd);
    if (!account) {
      this.log.error(AccountErrors.domainNotFound(userInfo.hd));
      throw new NotFoundException(AccountErrors.domainNotFound(userInfo.hd));
    }
    const user = await this.userService.findOneByEmail(userInfo.email);
    if (user && user.isAdmin) {
      this.log.error(AccountErrors.adminLink(), JSON.stringify(user));
      throw new ForbiddenException(AccountErrors.adminLink());
    }
    if (!user || (user && user.role !== UserRoles.DISTRICT_USER)) {
      throw new UnauthorizedException(GoogleApisErrors.contactAdmin());
    }
    if (user && user.role === UserRoles.DISTRICT_USER) {
      const payload = {
        userId: user?.id,
        accountId: account?.id,
      } as GoogleOauthTokenDto;

      const jwt_token = await this.jwtTokenService.generateRegistrationToken(payload);
      return {jwt_token} as LoginTokenResponseDto;
    }
  }

  /** Get user profile info
   * @returns user profile info
   */
  async getUserInfo(oauthClient) {
    try {
      const {data} = await google.oauth2({auth: oauthClient, version: 'v2'}).userinfo.get();
      if (!data) {
        this.log.error(GoogleApisErrors.profile());
        throw new InternalServerErrorException(GoogleApisErrors.profile());
      }
      return data;
    } catch (error) {
      this.log.error(GoogleApisErrors.profile(error));
      throw new InternalServerErrorException(GoogleApisErrors.profile());
    }
  }

  /** Get root OU
   * @returns return root organization unit
   */
  async getRootOrgUnits(oauthClient) {
    const service = google.admin({
      version: 'directory_v1',
      auth: oauthClient,
    });
    return service.orgunits
      .list({
        customerId: 'my_customer',
        type: 'ALL',
      })
      .then((res) => {
        const organizationUnits = res.data.organizationUnits;
        if (organizationUnits && organizationUnits.length > 0) {
          const foundOU = organizationUnits.find((ou) => ou.parentOrgUnitPath === '/');
          return service.orgunits
            .get({
              customerId: 'my_customer',
              orgUnitPath: foundOU.parentOrgUnitId,
            })
            .then((res) => {
              return res.data;
            })
            .catch((e) => {
              throw new UnauthorizedException(e);
            });
        } else {
          throw new ValidationException('Atleast two organizational units required to create an account.');
        }
      })
      .catch((e) => {
        if (e?.status === 400) {
          this.log.info(e);
          throw e;
        }
        throw new UnauthorizedException(e);
      });
  }

  @Cron('*/59 * * * *')
  async syncUsers(): Promise<void> {
    this.log.info('CRON JOB STARTED TO SYNC THE USERS AT....', new Date());
    const options = {where: {accountTypeId: AccountTypes.SCHOOL}};
    const accounts = await this.accountService.findAll(options);
    for (const account of accounts) {
      const authToken = await this.authTokenService.findTokenByPrimaryDomain(account.primaryDomain);
      if (authToken) {
        await this.directoryService.syncUsers(account.id, authToken);
      }
    }
    this.log.info('CRON JOB TO SYNC THE USERS FINISHED AT....', new Date());
  }
}
