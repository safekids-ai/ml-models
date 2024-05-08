import { EMAILFEEDBACK } from '../constants';
import { EmailMLFeedback } from './entities/email-feedback.entity';

export const emailFeedbackProviders = [
    {
        provide: EMAILFEEDBACK,
        useValue: EmailMLFeedback,
    },
];
