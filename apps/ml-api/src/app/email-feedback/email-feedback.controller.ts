import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailFeedbackService } from './email-feedback.service';
import { EmailMLFeedback } from './entities/email-feedback.entity';
import { CreateEmailMLFeedbackDto } from './dto/create-email-feedback.dto';
import { ApiKeyGuard } from '../auth/guard/api-key.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email feedback')
@Controller('v2/email/feedback')
export class EmailFeedbackController {
    constructor(private readonly emailFeedbackService: EmailFeedbackService) {}

    @ApiOperation({ summary: 'Creates email ML feedback.' })
    @ApiBearerAuth()
    @UseGuards(ApiKeyGuard)
    @Post()
    async create(@Body() createEmailFeedbackDto: CreateEmailMLFeedbackDto): Promise<EmailMLFeedback> {
        console.log(`create this ${JSON.stringify(createEmailFeedbackDto)}`);
        return await this.emailFeedbackService.create(createEmailFeedbackDto);
    }
}
