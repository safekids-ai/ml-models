import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { enrollmentProviders } from './enrollment.providers';
import { databaseProviders } from '../core/database/database.providers';

@Module({
    providers: [EnrollmentService, ...enrollmentProviders, ...databaseProviders],
    exports: [EnrollmentService],
})
export class EnrollmentModule {}
