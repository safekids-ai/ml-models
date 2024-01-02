import {EMAIL_OPT_IN} from "./endpoint";
import {HTTPMethod, HttpService} from "./httpService";
import {getJWTToken, getOnBoardingPage, OptIn, readLocalStorage, redirectTab, writeToLocalStorage} from "./chromeUtil";
import {Logger} from "../../../common/utils/Logger";
export class OnBoardingService {
    constructor(private logger: Logger,private httpService: HttpService) {
    }

    /**
     * save Opt In
     * @param optIn
     */
    saveUserOnboarding = async (optIn: OptIn) : Promise<any> => {
            this.markOnBoardingDone();
            const jwt = await getJWTToken();
            if (jwt) {
                return  await this.storeUserOptInBackend(optIn).catch((error)=>{
                    throw new Error(`Error occurred while saving onboarding to backend. ${error}`);
                });
            }
    };

    /**
     * Send saving optin request to backend
     * @param optIn
     */
    storeUserOptInBackend = async (optIn: OptIn) : Promise<any> => {
        try {
            const result = await this.httpService.fetch(`${EMAIL_OPT_IN}`, HTTPMethod.POST, optIn)
            this.logger.debug(`Result: EMAIL_OPT_IN -> ${result ? JSON.stringify(result) : result}`);
            return result;
        } catch (e) {
            this.logger.error(`OptIn Not Saved.`);
            throw e;
        }
    }

    storeUserOptInLocal = async (optIn: OptIn) : Promise<void> => {
            await writeToLocalStorage({optIn: optIn});
    }

    /**
     * Get Opt-in status of user
     */
    getUserOptInFromBackend = async (): Promise<OptIn> => {
        let result;
        try {
            result = await this.httpService.fetch(`${EMAIL_OPT_IN}`, HTTPMethod.GET);
            this.logger.debug(`Result of Optin from backend -> ${JSON.stringify(result)}`);
        } catch (error) {
            this.logger.error(`OptIn Not Received.`);
        }
        return result;
    }
    readUserOptInLocally = async (): Promise<OptIn | undefined> => {
        return await readLocalStorage("optIn")
    }
    /**
     * Check if user has not opted in then onboard
     */
    shouldOnboardUser = async () => {
        const localOnboarding = await this.getOnBoardingStatus()
        let shouldShowOnBoarding = !localOnboarding;
        const jwt = await getJWTToken();
        if (jwt) {
            const remoteOptIn : OptIn = await this.getUserOptInFromBackend();
            if(remoteOptIn && remoteOptIn.onboardingDone){
                this.markOnBoardingDone();
            }
            shouldShowOnBoarding = shouldShowOnBoarding && (!remoteOptIn || !remoteOptIn.onboardingDone);
        }
        return shouldShowOnBoarding;
    }
    /**
     * Check if user has not opted in then show onboarding screen.
     */
    checkOnBoarding = async (): Promise<void> => {
        try {
            const shouldOnboard = await this.shouldOnboardUser();
            //show on-boarding screen if user opt-in not found locally and in backend
            if (shouldOnboard) {
                this.redirectToOnBoarding();
            }
        } catch (e) {
            this.logger.error(`Error occurred while checking on-boarding. ${e}`);
            throw e;
        }
    };

    redirectToOnBoarding = async (): Promise<void> => {
       this.markOnBoardingDone();
       redirectTab(getOnBoardingPage());
    }

    markOnBoardingDone = async (): Promise<void> => {
        await writeToLocalStorage({isOnboardingDone: true});
    }

    getOnBoardingStatus = async (): Promise<any> => {
        return await readLocalStorage("isOnboardingDone");
    }

}



