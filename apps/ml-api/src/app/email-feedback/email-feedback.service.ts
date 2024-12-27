import { Inject, Injectable } from '@nestjs/common';
import { EMAILFEEDBACK } from '../constants';
import { EmailMLFeedback } from './entities/email-feedback.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateEmailMLFeedbackDto } from './dto/create-email-feedback.dto';

@Injectable()
export class EmailFeedbackService {
    constructor(@Inject(EMAILFEEDBACK) private readonly repository: typeof EmailMLFeedback) {}
    async create(createEmailFeedbackDto: CreateEmailMLFeedbackDto): Promise<EmailMLFeedback> {
        if (!createEmailFeedbackDto.id) {
            createEmailFeedbackDto.id = uuidv4();
        }
        return await this.repository.create(createEmailFeedbackDto);
    }
}
