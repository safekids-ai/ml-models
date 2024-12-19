/* eslint-disable @typescript-eslint/no-explicit-any */

import {HTTPMethod, HttpService} from "./httpService";
import {getBrowserInfo} from "@shared/utils/Utils";
import {Logger} from "@shared/utils/Logger";
import {EmailNotificationEvent} from "@shared/types/events.types";
import {SAVE_EVENT} from "./endpoint";
import {OnBoardingService} from "./onboarding";
import {EmailMessage} from "@shared/types/EmailMessage";

export class EmailEventService {

    constructor(private logger: Logger,private httpService: HttpService,private onboardingService: OnBoardingService) {
    }

    async sendEvent(event: EmailNotificationEvent): Promise<any | EmailNotificationEvent> {
        try {
            const optIn = await this.onboardingService.readUserOptInLocally();
            if(!optIn || !optIn.emailOptInSelection){
              event.emailMessage = null;
            }

            if(event.emailMessage != null){
                event.emailMessage = new EmailMessage(null,null,event.emailMessage.subject,event.emailMessage?.body);
            }

            this.logger.debug(`Email Message is ${JSON.stringify(event.emailMessage)}`);

            event.eventTime = new Date();
            event.mlVersion = "1.0.0"; //TO DO HACK.... PLEASE CHANGE ME
            event.platform = "CHROMEBOOK";
            event.extensionVersion = chrome.runtime.getManifest().version;
            event.browserVersion = getBrowserInfo().split(' ')[1];
            event.browser = getBrowserInfo().split(' ')[0];
            const result = await this.httpService.fetch(`${SAVE_EVENT}`, HTTPMethod.POST, event);
            return result
        } catch (e) {
            this.logger.debug(`Event ${event.eventTypeId} not saved.`)
        }
    }
}

