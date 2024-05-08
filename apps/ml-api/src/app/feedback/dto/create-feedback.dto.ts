import { FeedbackAttributes } from '../entities/feedback.entity';

export class CreateFeedbackDto implements FeedbackAttributes {
    prrCategoryId: string;
    prrImages: object;
    prrTexts: object;
    prrTriggerId: string;
    type: string;
    webUrl: string;
    accountId?: string;
    userDeviceLinkId?: string;
}
