import { Inject, Injectable } from '@nestjs/common';
import { EMAILFEEDBACK } from '../constants';
import { EmailMLFeedback } from './entities/email-feedback.entity';
import { uuid } from 'uuidv4';
import { CreateEmailMLFeedbackDto } from './dto/create-email-feedback.dto';

@Injectable()
export class EmailFeedbackService {
    constructor(@Inject(EMAILFEEDBACK) private readonly repository: typeof EmailMLFeedback) {}
    async create(createEmailFeedbackDto: CreateEmailMLFeedbackDto): Promise<EmailMLFeedback> {
        if (!createEmailFeedbackDto.id) {
            createEmailFeedbackDto.id = uuid();
        }
        return await this.repository.create(createEmailFeedbackDto);
    }
}
