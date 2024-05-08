import { EmailMLFeedbackAttributes } from '../entities/email-feedback.entity';

export class CreateEmailMLFeedbackDto implements EmailMLFeedbackAttributes {
    body: string;
    emailDateTime: Date;
    extVersion: string;
    fromEmail: string;
    fromName: string;
    id?: string;
    mlVersion: string;
    subject: string;
    toEmail: string;
    toName: string;
    threadId: string;
}
