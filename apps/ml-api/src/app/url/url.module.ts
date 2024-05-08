import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { urlProviders } from './url.providers';
import { UrlService } from './url.service';
import { accountProviders } from '../accounts/account.providers';

@Module({
    controllers: [UrlController],
    providers: [UrlService, ...urlProviders, ...accountProviders],
    exports: [UrlService],
})
export class UrlModule {}
