import { Module } from '@nestjs/common';
import { GoogleApiService } from './google.apis.service';

@Module({
    providers: [GoogleApiService],
    exports: [GoogleApiService],
})
export class GoogleApisModule {}
