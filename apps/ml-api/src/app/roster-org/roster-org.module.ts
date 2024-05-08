import { Module } from '@nestjs/common';
import { RosterOrgService } from './roster-org.service';
import { rosterOrgProviders } from './roster-org.providers';
import { databaseProviders } from '../core/database/database.providers';

@Module({
    providers: [RosterOrgService, ...rosterOrgProviders, ...databaseProviders],
    exports: [RosterOrgService],
})
export class RosterOrgModule {}
