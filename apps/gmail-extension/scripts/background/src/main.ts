/******/
import {NLPModelWrapper} from "./model/NLPModelWrapper";
import {NLPResultCache} from "./cache/NLPResultCache";
import {ILogger, Logger} from "../../common/utils/Logger";
import {BackgroundEventHandler} from "./BackgroundEventHandler";
import {AuthService} from "./api/authService";
import {ChromeStorageFactory} from "./cache/ChromeStorage";
import {EmailEventService} from "./api/emailEventService";
import {onUpdatedTabListener} from "./chrome/tabListener/onUpdatedTabListener";
import {HttpService} from "./api/httpService";
import {OnBoardingService} from "./api/onboarding";

(() => { // webpackBootstrap
    //var __webpack_exports__ = {};
    /*!***************************************************!*\
      !*** ./node_modules/@inboxsdk/core/background.js ***!
      \***************************************************/
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'inboxsdk__injectPageWorld' && sender.tab) {

            if (chrome.scripting) {
                // MV3
                if (sender.tab && sender.tab.id) {
                    const target = {tabId: sender.tab.id};
                    chrome.scripting.executeScript({
                        target: target,
                        world: 'MAIN',
                        files: ['pageWorld.js'],
                    });
                    sendResponse(true);
                }
            } else {
                // MV2 fallback. Tell content script it needs to figure things out.
                sendResponse(false);
            }
        }
    });

    /******/
})()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU2FmZSBLaWRzIEFJIEVtYWlsLy4vbm9kZV9tb2R1bGVzL0BpbmJveHNkay9jb3JlL2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobWVzc2FnZS50eXBlID09PSAnaW5ib3hzZGtfX2luamVjdFBhZ2VXb3JsZCcgJiYgc2VuZGVyLnRhYikge1xuICAgIGlmIChjaHJvbWUuc2NyaXB0aW5nKSB7XG4gICAgICAvLyBNVjNcbiAgICAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICAgIHRhcmdldDogeyB0YWJJZDogc2VuZGVyLnRhYi5pZCB9LFxuICAgICAgICB3b3JsZDogJ01BSU4nLFxuICAgICAgICBmaWxlczogWydwYWdlV29ybGQuanMnXSxcbiAgICAgIH0pO1xuICAgICAgc2VuZFJlc3BvbnNlKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNVjIgZmFsbGJhY2suIFRlbGwgY29udGVudCBzY3JpcHQgaXQgbmVlZHMgdG8gZmlndXJlIHRoaW5ncyBvdXQuXG4gICAgICBzZW5kUmVzcG9uc2UoZmFsc2UpO1xuICAgIH1cbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=


const init = async (): Promise<void> => {
    const logger = new Logger();

    const chromeStorage = ChromeStorageFactory.manifestV3();

    const authService = new AuthService(logger);
    const httpService = new HttpService(logger);

    const onboardingService = new OnBoardingService(logger,httpService);

    const emailEventService = new EmailEventService(logger,httpService,onboardingService);

    //load the model
    const model = await new NLPModelWrapper(logger);
    await model.load();

    //load cache
    const nlpCache = await new NLPResultCache(logger, chromeStorage, model.version());
    nlpCache.load();

    //event handler to listen for background events
    const eventHandler = new BackgroundEventHandler(logger, nlpCache, model, emailEventService,onboardingService);

    load(logger, eventHandler);

    authService.checkLogin().then(()=> {
        onboardingService.checkOnBoarding().catch((e)=>{
            logger.debug(`Failed to start On-boarding. ${JSON.stringify(e)}`);
        });
    }).catch ((e) => {
        logger.debug(`Failed to login. ${JSON.stringify(e)}`)
    });
}

const load = (logger: ILogger, eventHandler: BackgroundEventHandler) => {
    logger.log("BACKGROUND ML Model loaded");

    // Event when content sends request to filter image
    chrome.runtime.onMessage.addListener((message, sender, callback: (value: any) => void) => {
        return eventHandler.onMessage(message, sender, callback);
    });

    // Event when user opens a new tab or updates tab's url
    chrome.tabs.onUpdated.addListener(async function (tabId, tabInfo, tab) {
        if (tabInfo.url) {
            await onUpdatedTabListener(tabId, tabInfo, tab,)
        }
    })
};

init();
