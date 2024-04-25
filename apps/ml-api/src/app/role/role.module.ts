import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { roleProviders } from './role.providers';

@Module({
    providers: [RoleService, ...roleProviders],
    exports: [RoleService],
})
export class RoleModule {}
