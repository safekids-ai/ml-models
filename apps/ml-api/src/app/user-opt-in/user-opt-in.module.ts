import { Module } from '@nestjs/common';
import { UserOptInService } from './user-opt-in.service';
import { UserOptInController } from './user-opt-in.controller';
import { userOptInProviders } from './user-opt-in.providers';

@Module({
    controllers: [UserOptInController],
    providers: [UserOptInService, ...userOptInProviders],
    exports: [UserOptInService],
})
export class UserOptInModule {}
