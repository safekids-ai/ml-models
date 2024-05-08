import { Body, Controller, Post } from '@nestjs/common';
import { UserOptInService } from './user-opt-in.service';
import { CreateUserOptInDto } from './dto/create-opt-in.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User opt in')
@Controller('v2/users/optin')
export class UserOptInController {
    constructor(private readonly optInService: UserOptInService) {}

    @ApiOperation({ summary: 'Creates a user opt in for email with time.' })
    @Post()
    create(@Body() createOptInDto: CreateUserOptInDto) {
        return this.optInService.create(createOptInDto);
    }
}
