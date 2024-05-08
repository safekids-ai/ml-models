import { Inject, Injectable } from '@nestjs/common';
import { USER_AUTHTOKEN_REPOSITORY } from '../constants';
import { AuthToken, AuthTokenCreationAttributes } from './entities/auth-token.entity';
import { uuid } from 'uuidv4';
import { LoggingService } from '../logger/logging.service';
import { QueryException } from '../error/common.exception';
import { QueryTypes } from 'sequelize';
import { GoogleApiService } from '../google-apis/google.apis.service';

@Injectable()
export class AuthTokenService {
    constructor(
        @Inject(USER_AUTHTOKEN_REPOSITORY) private readonly authTokenRepository: typeof AuthToken,
        private readonly googleApiService: GoogleApiService,
        private readonly log: LoggingService
    ) {}

    async create(createAuthTokenDto: AuthTokenCreationAttributes): Promise<void> {
        // if (createAuthTokenDto.accessToken){
        //   createAuthTokenDto.accessToken = await CryptoUtil.encrypt(createAuthTokenDto.accessToken)
        // }
        // if (createAuthTokenDto.refreshToken){
        //   createAuthTokenDto.refreshToken = await CryptoUtil.encrypt(createAuthTokenDto.refreshToken);
        // }
        createAuthTokenDto.id = uuid();
        await this.authTokenRepository.create(createAuthTokenDto);
    }

    async findByUserId(userId: string): Promise<AuthToken> {
        return await this.authTokenRepository.findOne({ where: { userId: userId } });
    }

    async findByUserIdDecrypted(userId: string): Promise<AuthToken> {
        const token: AuthToken = await this.findByUserId(userId);
        // token.accessToken = await CryptoUtil.decrypt(token.accessToken);
        // token.refreshToken = await CryptoUtil.decrypt(token.refreshToken);
        return token;
    }

    update(id: string, updateAuthTokenDto: Partial<AuthTokenCreationAttributes>) {
        return this.authTokenRepository.update(updateAuthTokenDto, { where: { id } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.authTokenRepository.destroy({ where: { userId: ids } });
    }

    async upsert(authTokenDTO: AuthTokenCreationAttributes): Promise<AuthToken> {
        // if (authTokenDTO.accessToken){
        //   authTokenDTO.accessToken = await CryptoUtil.encrypt(authTokenDTO.accessToken)
        // }
        // if (authTokenDTO.refreshToken){
        //   authTokenDTO.refreshToken = await CryptoUtil.encrypt(authTokenDTO.refreshToken);
        // }

        try {
            const found = await this.authTokenRepository.findOne({ where: { userId: authTokenDTO.userId } });
            if (found) {
                await this.update(found.id, authTokenDTO);
            } else {
                await this.create(authTokenDTO);
            }
            return await this.authTokenRepository.findOne({ where: { userId: authTokenDTO.userId } });
        } catch (e) {
            this.log.error(QueryException.upsert(e));
            throw new QueryException(QueryException.upsert());
        }
    }

    async findTokenByPrimaryDomain(primaryDomain: string): Promise<AuthToken> {
        const authTokens = await this.findTokens(primaryDomain);
        for (const authToken of authTokens) {
            try {
                await this.googleApiService.fetchOneUser(authToken);
                return authToken;
            } catch (e) {
                this.log.error(`Following auth token... ${JSON.stringify(authToken)} has thrown the error.. ${e}`);
            }
        }
        this.log.error(`No valid token found for domain ${primaryDomain}`);
        return null;
    }

    private async findTokens(primaryDomain: string) {
        const query =
            'select token.id, token.access_token, token.refresh_token, token.user_id ' +
            ' from auth_token token ' +
            ' inner join user u on ' +
            ' u.id = token.user_id ' +
            ' and u.is_admin = true ' +
            ' inner join account a on ' +
            ' u.account_id = a.id ' +
            ' where ' +
            ' ((a.primary_domain = :primaryDomain) OR ' +
            " (POSITION(CONCAT('.',a.primary_domain) IN :primaryDomain) > 0 and a.account_type_id = 'SCHOOL') ) ";
        return await this.authTokenRepository.sequelize.query(query, {
            replacements: { primaryDomain },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: AuthToken,
        });
    }
}
