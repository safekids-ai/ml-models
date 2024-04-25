import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CALENDAR_REPOSITORY, FEEDBACK_REPOSITORY } from '../constants';
import { AccountCalendar } from '../calendar/entities/calendar.entity';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
    constructor(@Inject(FEEDBACK_REPOSITORY) private readonly feedbackRepository: typeof Feedback) {}
    async create(createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackRepository.create(createFeedbackDto);
    }

    findAll() {
        return this.feedbackRepository.findAll();
    }

    findOne(id: number) {
        return this.feedbackRepository.findAll({ where: { id } });
    }

    update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
        return this.feedbackRepository.update(updateFeedbackDto, { where: { id } });
    }

    remove(id: number) {
        return this.feedbackRepository.destroy({ where: { id } });
    }
}
