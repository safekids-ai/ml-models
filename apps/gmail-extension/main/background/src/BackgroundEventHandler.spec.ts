import {BackgroundEventHandler} from "./BackgroundEventHandler";
import {
    EmailNotificationEvent, EventType,
    IDType,
    NLPRequestEvent,
    NLPResponse,
    ToxicStatusRequestEvent, ToxicStatusResponseEvent
} from "@shared/types/events.types";
import {IChromeStorage} from "./cache/ChromeStorage";
import {NLPResultCache} from "./cache/NLPResultCache";
import {Logger} from "@shared/utils/Logger";
import {EmailEventService} from "./api/emailEventService";
import {NLPModelWrapperInterface} from "./model/NLPModelWrapperInterface";
import {MessageId} from "@shared/types/MessageId";
import { mock, instance, when, verify } from 'ts-mockito';

import MessageSender = chrome.runtime.MessageSender;
import {HttpService} from "./api/httpService";
import {OnBoardingService} from "./api/onboarding";
import {EmailEvent} from "@shared/types/EmailEvent";

class MockEmailService extends EmailEventService {
    async sendEvent(event: EmailNotificationEvent | any): Promise<EmailNotificationEvent> {
        const mockEvent = mock<EmailNotificationEvent>();
        return Promise.resolve(mockEvent);
    }
}

//common mock implementations
jest.mock('src/constants', () => ({
  ENVIRONMENT: 'development',
  API_URL: 'http://localhost:3000'
}));

const logger = new Logger();
const httpService = mock<HttpService>();
const onBoardingService = mock<OnBoardingService>();
const mockEmailService = new MockEmailService(logger,httpService,onBoardingService);
const mockNlpWrapperToxic = {
    isToxic: jest.fn( (a, b, c) => new Promise( (resolve) => resolve(true))),
    version: jest.fn(() => "1.0")
} as NLPModelWrapperInterface;
const mockNlpWrapperClean = {
    isToxic: jest.fn( (a, b, c) => new Promise( (resolve) => resolve(false))),
    version: jest.fn(() => "1.0")
} as NLPModelWrapperInterface;
const chromeStorage = {
    get: jest.fn( (key) => new Promise( (resolve) => {
        if (key === "NLP_VERSION") return resolve("1.0");
        if (key === "SK_GMAIL.USER_CLEAN") return resolve("abc|def");
        if (key === "SK_GMAIL.USER_TOXIC") return resolve("ghi|jkl");
        if (key === "SK_GMAIL.CLEAN") return resolve("mno|pqr");
        if (key === "SK_GMAIL.TOXIC") return resolve("stu|vwx");
    })),
    set: jest.fn( (key) => new Promise( (resolve) => {
    })),

} as IChromeStorage;

describe ("BackgroundEventHandler", () => {
    test ('onMessage - ToxicRequest', async () => {
        const customChromeStorage = {
            get: jest.fn( (key) => new Promise( (resolve) => {
                if (key === "NLP_VERSION") return resolve("1.0");
                if (key === "SK_GMAIL.USER_CLEAN") return resolve("jkl-T");
                if (key === "SK_GMAIL.USER_TOXIC") return resolve("ghi-T");
                if (key === "SK_GMAIL.CLEAN") return resolve("mno-T");
                if (key === "SK_GMAIL.TOXIC") return resolve("pqr-M|klm-T");
            })),
            set: jest.fn( (key) => new Promise( (resolve) => {
            })),
        } as IChromeStorage;

        const mockNlpWrapperCustom = {
            isToxic: jest.fn( (a, b, c) => new Promise( (resolve) => {
                const toxic = (a === "toxic message");
                resolve(toxic);
            })),
            version: jest.fn(() => "1.0")
        } as NLPModelWrapperInterface;

        const cache = await new NLPResultCache(logger, customChromeStorage, "1.0");
        await cache.load();
        cache.stopInterval();
        const eventHandler = new BackgroundEventHandler(logger, cache, mockNlpWrapperCustom, mockEmailService,onBoardingService);
        const mno = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:["mno"]} as ToxicStatusRequestEvent};
        const pqr = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:["pqr"]} as ToxicStatusRequestEvent};
        const ghi = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:["ghi"]} as ToxicStatusRequestEvent};
        const jkl = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:["jkl"]} as ToxicStatusRequestEvent};
        const request5 = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:["mno", "pqr", "ghi", "jkl", "klm"]} as ToxicStatusRequestEvent};
        const emptyData = {type: MessageId.GET_ML_TOXIC_STATUS, val: {ids:[]} as ToxicStatusRequestEvent};
        const mockSender = mock<MessageSender>();

        //cache hits
        eventHandler.onMessage(emptyData, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([]));
        });

        eventHandler.onMessage(mno, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([false]));
        });

        eventHandler.onMessage(pqr, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([true]));
        });

        eventHandler.onMessage(ghi, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([false]));
        });

        eventHandler.onMessage(jkl, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([false]));
        });

        eventHandler.onMessage(request5, mockSender, (response: any) => {
            expect(response).toStrictEqual(new ToxicStatusResponseEvent([false, true, false, false, true]));
        });
    });


    test ('onMessage - NLPEmailEvent Thread and Message Read', async () => {
        const customChromeStorage = {
            get: jest.fn( (key) => new Promise( (resolve) => {
                if (key === "NLP_VERSION") return resolve("1.0");
                if (key === "SK_GMAIL.USER_CLEAN") return resolve("");
                if (key === "SK_GMAIL.USER_TOXIC") return resolve("ghi-M|pqr-T");
                if (key === "SK_GMAIL.CLEAN") return resolve("mno-M|xyz-T");
                if (key === "SK_GMAIL.TOXIC") return resolve("");
            })),
            set: jest.fn( (key) => new Promise( (resolve) => {
            })),
        } as IChromeStorage;

        const mockNlpWrapperCustom = {
            isToxic: jest.fn( (a:string, b, c) => new Promise( (resolve) => {
                const toxic = a.includes("toxic message");
                resolve(toxic);
            })),
            version: jest.fn(() => "1.0")
        } as NLPModelWrapperInterface;

        const cache = await new NLPResultCache(logger, customChromeStorage, "1.0");
        await cache.load();
        cache.stopInterval();
        const eventHandler = new BackgroundEventHandler(logger, cache, mockNlpWrapperCustom, mockEmailService,onBoardingService);

        //test threads
        const threadCacheClean = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_THREAD_READ_EVENT, email: {body: "test", from: null, messageId: null, subject: "test", threadId: "xyz", to: null}} as EmailEvent
        };
        const threadCacheToxic = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_THREAD_READ_EVENT, email: {body: "test", from: null, messageId: null, subject: "test", threadId: "pqr", to: null}} as EmailEvent
        };
        const threadDirectClean = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_THREAD_READ_EVENT, email: {body: "test", from: null, messageId: null, subject: "test", threadId: "klo", to: null}} as EmailEvent
        };
        const threadDirectToxic = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_THREAD_READ_EVENT, email: {body: "", from: null, messageId: null, subject: "toxic message", threadId: "ppp", to: null}} as EmailEvent
        };

        //test messages
        const messageCacheClean = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_READ_EVENT, email: {body: "test", from: null, messageId: "mno", subject: "test", threadId: null, to: null}} as EmailEvent
        };
        const messageCacheToxic = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_READ_EVENT, email: {body: "test", from: null, messageId: "ghi", subject: "test", threadId: null, to: null}} as EmailEvent
        };
        const messageDirectClean = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_READ_EVENT, email: {body: "test", from: null, messageId: "zzz", subject: "test", threadId: null, to: null}} as EmailEvent
        };
        const messageDirectToxic = {
            type: MessageId.NLP_EMAIL_EVENT,
            val: {eventType: EventType.EMAIL_READ_EVENT, email: {body: "toxic message", from: null, messageId: "toxic", subject: "test", threadId: null, to: null}} as EmailEvent
        };

        const mockSender = mock<MessageSender>();

        //cache hits
        eventHandler.onMessage(messageCacheClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(messageCacheToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });
        eventHandler.onMessage(threadCacheClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(threadCacheToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });

        //model hits
        eventHandler.onMessage(messageDirectClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(messageDirectToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });
        eventHandler.onMessage(threadDirectClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(threadDirectToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });
    });

    test ('onMessage - NPLRequest', async () => {
        const customChromeStorage = {
            get: jest.fn( (key) => new Promise( (resolve) => {
                if (key === "NLP_VERSION") return resolve("1.0");
                if (key === "SK_GMAIL.USER_CLEAN") return resolve("");
                if (key === "SK_GMAIL.USER_TOXIC") return resolve("ghi-T");
                if (key === "SK_GMAIL.CLEAN") return resolve("mno-T");
                if (key === "SK_GMAIL.TOXIC") return resolve("");
            })),
            set: jest.fn( (key) => new Promise( (resolve) => {
            })),
        } as IChromeStorage;

        const mockNlpWrapperCustom = {
            isToxic: jest.fn( (a, b, c) => new Promise( (resolve) => {
                const toxic = (a === "toxic message");
                resolve(toxic);
            })),
            version: jest.fn(() => "1.0")
        } as NLPModelWrapperInterface;

        const cache = await new NLPResultCache(logger, customChromeStorage, "1.0");
        await cache.load();
        cache.stopInterval();
        const eventHandler = new BackgroundEventHandler(logger, cache, mockNlpWrapperCustom, mockEmailService,onBoardingService);
        const messageCacheClean = {type: MessageId.GET_NLP_CtoB, val: {id:"mno", idType:IDType.THREAD_VIEW} as NLPRequestEvent};
        const messageCacheToxic = {type: MessageId.GET_NLP_CtoB, val: {id:"ghi", idType:IDType.THREAD_VIEW} as NLPRequestEvent};
        const messageDirectClean = {type: MessageId.GET_NLP_CtoB, val: {id:"zzz", idType:IDType.THREAD_VIEW} as NLPRequestEvent};
        const messageDirectToxic = {type: MessageId.GET_NLP_CtoB, val: {id:"toxic", idType:IDType.THREAD_VIEW, text: "toxic message"} as NLPRequestEvent};
        const mockSender = mock<MessageSender>();

        //cache hits
        eventHandler.onMessage(messageCacheClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(messageCacheToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });

        //model hits
        eventHandler.onMessage(messageDirectClean, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(false));
        });
        eventHandler.onMessage(messageDirectToxic, mockSender, (response: any) => {
            expect(response).toStrictEqual(new NLPResponse(true));
        });
    });

    test ('getCacheResult', async () => {
        const cache = await new NLPResultCache(logger, chromeStorage, "1.0");
        await cache.load();
        cache.stopInterval();

        const eventHandler = new BackgroundEventHandler(logger, cache, mockNlpWrapperClean, mockEmailService,onBoardingService);

        //check cache
        const cacheResultClean = eventHandler.getCacheResult("mno");
        expect(cacheResultClean).toStrictEqual(new NLPResponse(false));
        const cacheResultUserClean = eventHandler.getCacheResult("abc");
        expect(cacheResultUserClean).toStrictEqual(new NLPResponse(false));

        const cacheResultToxic = eventHandler.getCacheResult("stu");
        expect(cacheResultToxic).toStrictEqual(new NLPResponse(true));
        const cacheResultUserToxic = eventHandler.getCacheResult("ghi");
        expect(cacheResultUserToxic).toStrictEqual(new NLPResponse(true));

        //no cache
        const noCache = eventHandler.getCacheResult("wwwwww");
        expect(noCache).toBe(null);
    });

    test ('getTrimmedID', async () => {
        expect(BackgroundEventHandler.getTrimmedID("abcdefghijk", IDType.THREAD_VIEW)).toBe("ghijk-T");
        expect(BackgroundEventHandler.getTrimmedID("abcdefghijk", IDType.MESSAGE_VIEW)).toBe("ghijk-M");
    });

    test ('shortenID', async () => {
        expect(BackgroundEventHandler.shortenID("abcdefghijk")).toBe("ghijk");
        expect(BackgroundEventHandler.shortenID("abc")).toBe("abc");
    });

    test.skip ('saveOptIn', async () => {
        const mockOnboardingService= mock<OnBoardingService>();
        const customChromeStorage = mock<IChromeStorage>();
        const cache = await new NLPResultCache(logger, customChromeStorage, "1.0");
        let mockNlpWrapperCustom = mock<NLPModelWrapperInterface>();
        let mockSender = mock<MessageSender>();
        jest.spyOn(mockOnboardingService,"saveUserOnboarding").mockImplementation();

        const eventHandler = new BackgroundEventHandler(logger, cache, mockNlpWrapperCustom, mockEmailService,mockOnboardingService);

        const messageSaveOptIn = MessageId.SAVE_OPT_IN;
        //model hits
        eventHandler.onMessage(messageSaveOptIn, mockSender, (response: any) => {
        });
    });
});
