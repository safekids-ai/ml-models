import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InternalApiKeyService } from '../../internal-api-key/internal-api-key.service';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key-auth') {
    constructor(protected readonly internalApiKeyService: InternalApiKeyService) {
        super({ header: 'x-api-key', prefix: '' }, true, async (apikey, done, req) => {
            const checkKey = await internalApiKeyService.findOne(apikey);
            if (!checkKey) {
                return done(false);
            }
            return done(null, checkKey);
        });
    }
}
