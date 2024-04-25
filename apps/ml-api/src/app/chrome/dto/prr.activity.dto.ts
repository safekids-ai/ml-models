import { PrrMessage } from '../../activity/entities/activity.entity';
import { Categories } from '../../category/default-categories';
import { Statuses } from '../../status/default-status';
import { ActivityTypes } from '../../activity-type/default-activitytypes';
import { PrrLevels } from '../../prr-level/prr-level.default';
import { PrrTriggers } from '../../prr-trigger/prr-triggers,default';

export class PrrActivityDto {
    prrActivityTypeId: ActivityTypes;
    webUrl: string;
    fullWebUrl: string;
    prrLevelId: PrrLevels;
    prrTriggerId: PrrTriggers;
    prrCategoryId: Categories;
    webCategoryId: Categories;
    prrImages?: string[];
    prrTexts?: string[];
    prrMessage?: PrrMessage[];
    prrCoaches?: any;
    mlVersion?: string;
    nlpVersion?: string;
    extensionVersion?: string;
    browserVersion?: string;
    browser?: string;
    userDeviceLinkId?: string;
    accountId?: string;
    orgUnitId?: string;
    os?: string;
    userId?: string;
    deviceId?: string;
    userEmail?: string;
    userName?: string;
    activityTime?: Date;
    isOffDay?: boolean;
    isOffTime?: boolean;
    statusId: Statuses;
    teacherId?: string;
    teacherName?: string;
    accessLimited?: number;
    isAIGenerated?: boolean;
}

export class PrrInformVisitDto {
    eventId: string;
    visits: TabVisit[];
    userId?: string;
    accountId?: string;
    tabId?: number;
}

export type TabVisit = {
    url: string;
    time: Date;
};
