import {OnBoardingService} from "./onboarding";
import * as ChromeUtil from "./chromeUtil";
import {OptIn} from "./chromeUtil";
import {Logger} from "../../../common/utils/Logger"
import {HttpService} from "./httpService";

describe("background => OnBoarding Flow ", () => {
    const logger = new Logger();
    const httpService = new HttpService(logger);
    let onboardingService: OnBoardingService;

    beforeEach(() => {
        onboardingService = new OnBoardingService(logger, httpService);
    })

    test('save opt-in for school user.', async () => {

        const storeUserOptInBackendSpy = await mockStoreUserOptInBackendSpy(onboardingService);
        await mockReadJWTToken('fakejwttoken123456')
        const mockMarkOnBoardingDoneSpy = jest.spyOn(onboardingService, "markOnBoardingDone").mockImplementation(async () => {
            Promise.resolve();
        })

        const optin: OptIn = {onboardingDone: true, onboardingTime: new Date()}
        await onboardingService.saveUserOnboarding(optin);

        expect(storeUserOptInBackendSpy).toBeCalled();
        expect(mockMarkOnBoardingDoneSpy).toBeCalled();
    });

    test('save opt-in for consumer user.', async () => {

        const mockMarkOnBoardingDoneSpy = jest.spyOn(onboardingService, "markOnBoardingDone").mockImplementation(async () => {
            Promise.resolve();
        })
        await mockReadJWTToken(undefined)
        const storeUserOptInBackendSpy = await mockStoreUserOptInBackendSpy(onboardingService);

        const optin: OptIn = {onboardingDone: true, onboardingTime: new Date()}
        await onboardingService.saveUserOnboarding(optin)

        expect(mockMarkOnBoardingDoneSpy).toBeCalled()
        expect(storeUserOptInBackendSpy).toBeCalledTimes(0)
    });

    test('redirect to on-boarding page when on-boarding is not done.', async () => {

        jest.spyOn(onboardingService, "shouldOnboardUser").mockResolvedValue(true);
        const redirectToOnBoardingSpy = jest.spyOn(onboardingService, "redirectToOnBoarding")

        await onboardingService.checkOnBoarding()

        expect(redirectToOnBoardingSpy).toBeCalled()
        expect(redirectToOnBoardingSpy).toBeCalled()

    });

    test('Should allow onboard if user has not onboarded remotely.', async () => {
        jest.spyOn(ChromeUtil, "getJWTToken").mockResolvedValue("12134444");
        jest.spyOn(onboardingService, "getOnBoardingStatus").mockResolvedValue(false);
        const remoteOptInSpy = jest.spyOn(onboardingService, "getUserOptInFromBackend").mockResolvedValue({
            emailOptInSelection: true,
            onboardingDone: false,
        });

        const result = await onboardingService.shouldOnboardUser();

        //expect
        expect(result).toBeTruthy();
        expect(remoteOptInSpy).toBeCalled();
    });

    test('Should allow onboard if user has not logged in locally.', async () => {
        jest.spyOn(ChromeUtil, "getJWTToken").mockResolvedValue(undefined);
        jest.spyOn(onboardingService, "getOnBoardingStatus").mockResolvedValue(false);

        const result = await onboardingService.shouldOnboardUser();

        //expect
        expect(result).toBeTruthy();
    });

    test('Should not allow onboard if user has not logged in locally.', async () => {
        jest.spyOn(ChromeUtil, "getJWTToken").mockResolvedValue(undefined);
        jest.spyOn(onboardingService, "getOnBoardingStatus").mockResolvedValue(true);

        const result = await onboardingService.shouldOnboardUser();

        //expect
        expect(result).toBeFalsy();
    });
    test('Should not allow onboard if user has not logged in locally.', async () => {
        jest.spyOn(ChromeUtil, "getJWTToken").mockResolvedValue("12345678");
        jest.spyOn(onboardingService, "getOnBoardingStatus").mockResolvedValue(false);
        const remoteOptInSpy = jest.spyOn(onboardingService, "getUserOptInFromBackend").mockResolvedValue({
            onboardingDone: true,
        });
        const result = await onboardingService.shouldOnboardUser();

        //expect
        expect(remoteOptInSpy).toBeCalled();
        expect(result).toBeFalsy();
    });

    afterEach(() => {
        jest.restoreAllMocks()
    })
});
const mockReadJWTToken = async (token: any) => {
    jest.spyOn(ChromeUtil, "getJWTToken").mockResolvedValue(token)
}

const mockStoreUserOptInBackendSpy = async (onboardingService: OnBoardingService): Promise<any> => {
    return jest.spyOn(onboardingService, "storeUserOptInBackend").mockImplementation(async () => {
        Promise.resolve({})
    })
}
