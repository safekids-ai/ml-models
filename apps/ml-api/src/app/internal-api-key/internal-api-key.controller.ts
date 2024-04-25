import { Body, Controller, Post } from '@nestjs/common';
import { InternalApiKeyService } from './internal-api-key.service';
import type { InternalApiKeyCreationAttributes } from './entities/internal-api-key.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Internal api key')
@Controller('internal_api_key')
export class InternalApiKeyController {
    constructor(private readonly internalApiKeyService: InternalApiKeyService) {}

    @ApiOperation({ summary: 'Creates internal api key.' })
    @Post()
    create(@Body() createInternalApiKeyDto: InternalApiKeyCreationAttributes) {
        return this.internalApiKeyService.create(createInternalApiKeyDto);
    }
}
