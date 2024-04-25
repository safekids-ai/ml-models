import { Body, Controller, Get, Request, Response } from '@nestjs/common';
import { PrrManagerService } from './prr-manager.service';
import { CreatePrrManagerDto } from './dto/create-prr-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { extractQueryString } from '../utils/http.util';

@ApiTags('PrrManager')
@Controller('v2/prr')
export class PrrManagerController {
    constructor(private readonly prrManagerService: PrrManagerService) {}

    @Get('trigger')
    create(@Request() req, @Response() res, @Body() createPrrManagerDto: CreatePrrManagerDto) {
        const queryString = extractQueryString(`${req.protocol}://${req.get('Host')}${req.originalUrl}`);
        res.redirect(this.prrManagerService.process(createPrrManagerDto) + (queryString ? queryString : ''));
    }
}
