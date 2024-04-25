export type Domain = {
    y: number[];
    x: number[];
};
type EventObject = {
    date: string;
    eventId: string;
    feedbackProvided: boolean;
    imageBlurredUrl: string;
    imageThumbnailUrl: string;
    label: string[];
    objectName: string;
    score: number;
    timezone: string;
    isSafe?: boolean;
};
export type EventResponseObject = {
    event: EventObject;
    maxScore: number;
    maxUnsafeScore: number;
    _id: string;
};
export type EventsAPIResponse = EventResponseObject[];

export type ActivityResponseObject = {
    name: string;
    count: number;
    category: string;
    isSafe: boolean;
    type: string;
};
export type GetActivityResponse = ActivityResponseObject[];

export type GetActivityTimelineResponseObject = {
    dateString: string;
    date: DateObject;
    timeSpent: number;
    timezone: string;
};

export type GetActivityTimelineResponse = GetActivityTimelineResponseObject[];

export type DateObject = {
    year: number;
    month: number;
    day: number;
    hour?: number;
};

export type GetEventsResponse = {
    date: string;
    eventId: string;
    feedbackProvided: boolean;
    imageBlurredUrl: string;
    imageThumbnailUrl: string;
    label: string[];
    objectName: string;
    score: number;
    timezone: string;
    isSafe?: boolean;
    eventDetail: any;
}[];

export type EventsData = Omit<EventObject, 'label'> & {
    maxScore: number;
    maxUnsafeScore: number;
    _id: string;
    x: number;
    y: number;
    timestamp: number;
    actualTimestamp: number;
    category: string | undefined;
    // box: maxBox.box,
    videoAvailable: boolean;
    image: string;
    label: undefined;
    // imageBlurredUrl: event.imageBlurredUrl,
    // feedbackProvided: event.feedbackProvided,
};
