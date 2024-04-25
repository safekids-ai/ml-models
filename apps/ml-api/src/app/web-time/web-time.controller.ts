import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WebTimeService } from './web-time.service';
import { CreateWebTimeDto } from './dto/create-web-time.dto';
import { UpdateWebTimeDto } from './dto/update-web-time.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Web time')
@Controller('web-time')
export class WebTimeController {
    constructor(private readonly webTimeService: WebTimeService) {}

    @ApiOperation({ summary: 'Creates a web time configuration.' })
    @Post()
    create(@Body() createWebTimeDto: CreateWebTimeDto) {
        return this.webTimeService.create(createWebTimeDto);
    }

    @ApiOperation({ summary: 'Returns all web time configurations.' })
    @Get()
    findAll() {
        return this.webTimeService.findAll();
    }

    @ApiOperation({ summary: 'Returns a web time configuration.' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.webTimeService.findOne(+id);
    }

    @ApiOperation({ summary: 'Updates a web time configuration.' })
    @Put(':id')
    update(@Param('id') id: string, @Body() updateWebTimeDto: UpdateWebTimeDto) {
        return this.webTimeService.update(+id, updateWebTimeDto);
    }

    @ApiOperation({ summary: 'Deletes a web time configuration.' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.webTimeService.remove(+id);
    }
}
