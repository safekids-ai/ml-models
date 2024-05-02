export type PrrMessagesBody = { responses: string[]; query: string };

export type Notification = {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    teacherName: string;
    schoolName: string;
    webUrl: string;
    fullWebUrl: string;
    prrCategory: string;
    read: boolean;
    prrMessages: PrrMessagesBody[];
    activityTime: Date;
    accessLimited: boolean;
};
