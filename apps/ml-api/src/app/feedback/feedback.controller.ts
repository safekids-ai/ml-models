import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('v2/webusage/activities/feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @ApiOperation({ summary: 'Creates feedback for kid.' })
    @Post()
    create(@Body() createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackService.create(createFeedbackDto);
    }

    @ApiOperation({ summary: 'Returns all feedback for account.' })
    @Get()
    findAll() {
        return this.feedbackService.findAll();
    }

    @ApiOperation({ summary: 'Returns feedback for single kid.' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.feedbackService.findOne(+id);
    }

    @ApiOperation({ summary: 'Updates feedback for kid.' })
    @Put(':id')
    update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
        return this.feedbackService.update(+id, updateFeedbackDto);
    }

    @ApiOperation({ summary: 'Deletes feedback for kid.' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.feedbackService.remove(+id);
    }
}
