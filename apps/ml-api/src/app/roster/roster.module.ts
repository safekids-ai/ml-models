import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtTokenModule } from '../auth/jwtToken/jwt.token.module';
import { OneRosterService } from './roster.service';
import { ApiKeyModule } from '../api-key/api-key.module';
import { RosterOrgModule } from '../roster-org/roster-org.module';
import { SchoolClassModule } from '../school-class/school-class.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [JwtTokenModule, HttpModule, forwardRef(() => ApiKeyModule), RosterOrgModule, SchoolClassModule, EnrollmentModule, UserModule],
    providers: [OneRosterService],
    exports: [OneRosterService],
})
export class OneRosterModule {}
