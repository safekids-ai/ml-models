import { Module } from '@nestjs/common';
import { SchoolClassService } from './school-class.service';
import { schoolClassProviders } from './school-class.providers';
import { databaseProviders } from '../core/database/database.providers';

@Module({
    providers: [SchoolClassService, ...schoolClassProviders, ...databaseProviders],
    exports: [SchoolClassService],
})
export class SchoolClassModule {}
