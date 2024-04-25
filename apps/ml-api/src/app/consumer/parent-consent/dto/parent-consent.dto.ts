import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ParentConsentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    hasLegalAuthorityToInstall: boolean;
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    boundByPrivacyPolicy: boolean;

    @ApiProperty()
    userId: string;
    @ApiProperty()
    accountId: string;
}
