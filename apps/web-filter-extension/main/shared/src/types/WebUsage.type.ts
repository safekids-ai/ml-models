import { PrrLevel } from '@shared/types/PrrLevel';
import { PrrTrigger } from '@shared/types/message_types';
import { PrrCategory } from '@shared/types/PrrCategory';

export type NotificationQuestionAnswerSet = {
  query: string;
  responses: string[];
};

export type WebUsageTypeDto = {
    userDeviceLinkId?: number;
    extensionVersion?: string;
    webUrl?: string;
    webCategory?: string;
    webActivityTypeId?: string;
    os?: string;
    mlVersion?: string;
    nlpVersion?: string;
    browser?: string;
    browserVersion?: string;
    prrImages?: string[];
    prrTexts?: string[];
    prrMessages?: NotificationQuestionAnswerSet[];
    prrLevelId?: PrrLevel;
    prrTriggerId?: PrrTrigger;
    prrCategoryId?: PrrCategory;
    prrActivityTypeId?: string;
    accessLimited?: boolean;
    webTitle?: string;
    fullWebUrl?: string;
    deviceMacAddress?: string;
    deviceIpAddress?: string;
    devicePublicWan?: string;
    location?: string;
    appName?: string;
    alertType?: string;
    keyword?: string;
    teacherId?: string;
    isAIGenerated?: boolean;
    isOffDay?: boolean;
    isOffTime?: boolean;
    webCategoryId?: PrrCategory;
    eventId?: string;
    activityTime?: Date;
};
