import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiKeyService } from './api-key.service';
import type { ServicesApiKeyCreationAttributes } from './entities/api-key.entity';
import { ApiKeysValidator } from './validation/api-keys-validator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Api keys')
@Controller('v2/config/accounts/apikeys')
export class ApiKeyController {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    @ApiOperation({ summary: 'Validates api keys and save them.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard, ApiKeysValidator)
    @Post()
    create(@Request() req, @Body() createApiKeyDto: ServicesApiKeyCreationAttributes) {
        createApiKeyDto.accountId = req.user.accountId;
        return this.apiKeyService.create(createApiKeyDto);
    }

    @ApiOperation({ summary: 'Returns api keys for specific account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findOneByAccount(@Request() req) {
        return this.apiKeyService.findOneByAccount(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates api keys for given id.' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(GoogleOauthGuard, ApiKeysValidator)
    update(@Request() req, @Param('id') id: string, @Body() updateApiKeyDto: Partial<ServicesApiKeyCreationAttributes>) {
        updateApiKeyDto.accountId = req.user.accountId;
        return this.apiKeyService.update(id, updateApiKeyDto);
    }
}
