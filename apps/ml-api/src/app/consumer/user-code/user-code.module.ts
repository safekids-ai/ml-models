import { Module } from '@nestjs/common';
import { UserCodeService } from './user-code.service';
import { userCodeProviders } from './user_code.providers';

@Module({
    providers: [...userCodeProviders, UserCodeService],
    exports: [UserCodeService],
})
export class UserCodeModule {}
