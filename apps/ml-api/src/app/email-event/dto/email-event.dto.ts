import { EmailEventAttributes, Flag } from '../entities/email-event.entity';
import { EmailEventTypes } from '../email-event-types';
import { Categories } from '../../category/default-categories';
import { EmailMessage } from '../email.message';
import { PrrUserAction } from '../../prr-action/prr-action.default';

export class EmailEventDto implements EmailEventAttributes {
    id: number;
    browser: string;
    browserVersion: string;
    eventTime: Date;
    eventTypeId: EmailEventTypes;
    extensionVersion: string;
    messageId: string;
    mlCategory?: Categories;
    mlFlag?: Flag;
    mlVersion?: string;
    platform: string;
    prrMessage?: string;
    prrTriggered?: boolean;
    prrOption?: boolean;
    prrAction?: PrrUserAction;
    emailMessage?: EmailMessage;
    fromName?: string;
    fromEmail?: string;
    toName?: string;
    toEmail?: string;
    subject?: string;
    body?: string;
    threadId: string;
    userFlag: Flag;
    accountId: string;
    userId: string;
    userDeviceLinkId: string;
    googleUserId?: string;
}
