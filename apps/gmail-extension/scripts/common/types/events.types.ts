/* eslint-disable @typescript-eslint/restrict-template-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {EmailMessage} from "./EmailMessage";

export class ToxicStatusRequestEvent {
    public readonly ids: string[];

    constructor(ids:string[]) {
        this.ids = ids;
    }
}

export class ToxicStatusResponseEvent {
    public readonly toxic: boolean[]
    public error: any

    constructor(toxic: boolean[]) {
        this.toxic = toxic;
    }
}

export class NLPRequestEvent {
    public readonly id: string | null;
    public readonly idType: IDType | null;
    public readonly text: string | null;
    public readonly maxWords?: number;
    public readonly toxicWordMatch?: boolean;

    constructor(id: string | null, idType: IDType | null, text: string | null, maxWords?: number, toxicWordMatch?: boolean) {
        this.id = id;
        this.idType = idType;
        this.text = text;
        this.maxWords = maxWords;
        this.toxicWordMatch = toxicWordMatch;
    }
}

export class EmailFeedbackEvent {
    public readonly threadID: string | null;
    public readonly messageID: string | null;
    public readonly message: EmailMessage;
    public readonly feedback: NLPFeedback;

    constructor(threadID: string | null, messageID: string | null, message: EmailMessage, feedback: NLPFeedback) {
        this.threadID = threadID;
        this.messageID = messageID;
        this.message = message;
        this.feedback = feedback;
    }
}

export class NLPResponse {
    public readonly isToxic: boolean
    public error: any

    constructor(isToxic?: boolean) {
         if (isToxic) {
             this.isToxic = isToxic;
         } else {
             this.isToxic = false;
         }
    }
}

export enum IDType {
    THREAD_VIEW = 2,
    MESSAGE_VIEW = 3
}

export enum NLPFeedback {
    CLEAN,
    TOXIC
}

export enum EventType {
    READ_MESSAGE = "READ_MESSAGE",
    EMAIL_THREAD_READ_EVENT = "EMAIL_THREAD_READ_EVENT",
    EMAIL_THREAD_FLAG_EVENT = "EMAIL_THREAD_FLAG_EVENT",
    EMAIL_READ_EVENT = "EMAIL_READ_EVENT",
    EMAIL_READ_PRR_EVENT = "EMAIL_READ_PRR_EVENT",
    EMAIL_MESSAGE_FLAG_EVENT = "EMAIL_MESSAGE_FLAG_EVENT",
    EMAIL_SEND_EVENT = "EMAIL_SEND_EVENT"
}

export enum Flag {
    KIND="KIND",
    UNKIND="UNKIND"
}

export enum CategoryType {
    ACCESS_LIMITED = "ACCESS_LIMITED",
    ALCOHOL = "ALCOHOL",
    BODY_IMAGE = "BODY_IMAGE",
    CRITICAL_THINKING = "CRITICAL_THINKING",
    DRUGS = "DRUGS",
    EXPLICIT = "EXPLICIT",
    GAMBLING = "GAMBLING",
    GAMING = "GAMING",
    ILLEGAL_ACTIVITY = "ILLEGAL_ACTIVITY",
    INTEGRITY = "INTEGRITY",
    PERMISSIBLE = "PERMISSIBLE",
    SELF_HARM = "SELF_HARM",
    SITUATIONAL_AWARENESS = "SITUATIONAL_AWARENESS",
    SOCIAL_NETWORKING = "SOCIAL_NETWORKING",
    TOBACCO = "TOBACCO",
    WEAPONS = "WEAPONS",
    SEARCH_ENGINES = "SEARCH_ENGINES",
    SHOPPING = "Online Shopping",
    PORTAL = "PORTAL"

}

export enum Platform {
    WINDOWS,
    MAC,
    CHROMEBOOK
}

export type EmailNotificationEvent = {
    eventTypeId: EventType;
    eventTime?: Date;
    threadId?: string | null;
    messageId?: string | null;
    userFlag?: Flag;
    mlFlag?: Flag | null;
    mlCategory?: CategoryType;
    prrTriggered?: boolean;
    prrMessage?: string;
    prrAction?: string;
    emailMessage?: EmailMessage | null;
    mlVersion?: string;
    browser?: string;
    browserVersion?: string;
    extensionVersion?: string;
    platform?: string;
}
