import { FEEDBACK_REPOSITORY } from '../constants';
import { Feedback } from './entities/feedback.entity';

export const feedbackProviders = [
    {
        provide: FEEDBACK_REPOSITORY,
        useValue: Feedback,
    },
];
