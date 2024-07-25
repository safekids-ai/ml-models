import { blockPRRPageType, interceptTimeType } from '../../reducers/settings';
import { PRRThreshold } from '../../store';

import {
    SET_PERMISSIBLE_URLS,
    SET_NON_PERMISSIBLE_URLS,
    SET_BLOCKED_PRR_PAGE_UPDATED,
    SET_CATEGORY_PRR_THRESHOLD,
    SET_EXTENSION_UPDATED,
    SET_FILTER_EFFECT,
    SET_FILTER_STRICTNESS,
    SET_IMAGE_ANALYZE_LIMIT,
    SET_LANGUAGE,
    SET_LIGHT_OFF_TIME,
    SET_ML_PROCESSLIMIT,
    SET_ML_PRR_THRESHOLD_MAX,
    SET_ML_PRR_THRESHOLD_MIN,
    SET_NLP_ANALYZE_LIMIT,
    SET_NLP_PROCESSLIMIT,
    SET_NLP_PRR_THRESHOLD_MAX,
    SET_NLP_PRR_THRESHOLD_MIN,
    SET_SCHOOL_HOLIDAY,
    SET_SCHOOL_TIME,
    SET_TRAINED_MODEL,
    SET_FILTERED_CATEGORIES,
    TOGGLE_BLOCKER,
    TOGGLE_DEBUG,
    TOGGLE_DEMO,
    TOGGLE_DIV_FILTERING,
    TOGGLE_LOGGING,
    TOGGLE_NPL,
    TOGGLE_PR_TRIGGER,
    TOGGLE_RUN_ML,
    TOGGLE_SHOW_CLEAN,
    SET_INTERCEPTION_CATEGORIES,
    SET_PPR2_THRESHOLD,
    SET_PPR1_LIMIT,
    SET_EXTENSION_ENABLED,
    TOGGLE_EXTENSION_ENABLED,
    SET_ENVIRONMENT,
    SET_INFORM_VISIT_LIMIT,
    SET_INFORM_TIMEOUT,
} from './settingsTypes';

export const toggleLogging = () => ({ type: TOGGLE_LOGGING } as const);
export const toggleDebug = () => ({ type: TOGGLE_DEBUG } as const);
export const toggleRunML = () => ({ type: TOGGLE_RUN_ML } as const);
export const toggleDivFiltering = () => ({ type: TOGGLE_DIV_FILTERING } as const);
export const togglePRTrigger = () => ({ type: TOGGLE_PR_TRIGGER } as const);
export const toggleNPL = () => ({ type: TOGGLE_NPL } as const);
export const toggleShowClean = () => ({ type: TOGGLE_SHOW_CLEAN } as const);
export const toggleBlocker = () => ({ type: TOGGLE_BLOCKER } as const);
export const toggleDemo = () => ({ type: TOGGLE_DEMO } as const);
export const toggleExtensionEnabled = () => ({ type: TOGGLE_EXTENSION_ENABLED } as const);

export const setFilterEffect = (filterEffect: 'hide' | 'blur') =>
    ({
        type: SET_FILTER_EFFECT,
        payload: { filterEffect },
    } as const);

export const setTrainedModel = (trainedModel: 'YOLOV') =>
    ({
        type: SET_TRAINED_MODEL,
        payload: { trainedModel },
    } as const);

export const setFilterStrictness = (filterStrictness: number) =>
    ({
        type: SET_FILTER_STRICTNESS,
        payload: { filterStrictness },
    } as const);

export const setMlPrrThresholdMax = (mLprrThresholdMax: number) =>
    ({
        type: SET_ML_PRR_THRESHOLD_MAX,
        payload: { mLprrThresholdMax },
    } as const);

export const setImagesAnalyzeLimit = (imageAnalyzeLimit: number) =>
    ({
        type: SET_IMAGE_ANALYZE_LIMIT,
        payload: { imageAnalyzeLimit },
    } as const);

export const setMlPrrThresholdMin = (mlPrrThresholdMin: number) =>
    ({
        type: SET_ML_PRR_THRESHOLD_MIN,
        payload: { mlPrrThresholdMin },
    } as const);

export const setNLPAnalyzeLimit = (nlpAnalyzeLimit: number) =>
    ({
        type: SET_NLP_ANALYZE_LIMIT,
        payload: { nlpAnalyzeLimit },
    } as const);

export const setNlpPrrThresholdMin = (nlpPrrThresholdMin: number) =>
    ({
        type: SET_NLP_PRR_THRESHOLD_MIN,
        payload: { nlpPrrThresholdMin },
    } as const);

export const setNlpPrrThresholdMax = (nlpPrrThresholdMax: number) =>
    ({
        type: SET_NLP_PRR_THRESHOLD_MAX,
        payload: { nlpPrrThresholdMax },
    } as const);

export const setNlpPopulationSize = (nlpProcessLimit: number) =>
    ({
        type: SET_NLP_PROCESSLIMIT,
        payload: { nlpProcessLimit },
    } as const);

export const setMlProcessLimit = (mlProcessLimit: number) =>
    ({
        type: SET_ML_PROCESSLIMIT,
        payload: { mlProcessLimit },
    } as const);

export const setExtensionUpdated = (extensionUpdated: boolean) =>
    ({
        type: SET_EXTENSION_UPDATED,
        payload: { extensionUpdated },
    } as const);

export const setBlockedPRRPage = (blockedPRRPage: blockPRRPageType) =>
    ({
        type: SET_BLOCKED_PRR_PAGE_UPDATED,
        payload: { blockedPRRPage },
    } as const);

export const setCategoryPRRThreshold = (prrThreshold: PRRThreshold) =>
    ({
        type: SET_CATEGORY_PRR_THRESHOLD,
        payload: { prrThreshold },
    } as const);

export const setLanguage = (language: string) =>
    ({
        type: SET_LANGUAGE,
        payload: { language },
    } as const);

export const setSchoolHoliday = (isHoliday: boolean) =>
    ({
        type: SET_SCHOOL_HOLIDAY,
        payload: { isHoliday },
    } as const);

export const setSchoolInterceptTime = (schoolTime: interceptTimeType) =>
    ({
        type: SET_SCHOOL_TIME,
        payload: { schoolTime },
    } as const);

export const setLightOffInterceptTime = (lightOffTime: interceptTimeType) =>
    ({
        type: SET_LIGHT_OFF_TIME,
        payload: { lightOffTime },
    } as const);

export const setNonPermissibleUrls = (nonPermissibleUrls: string[]) =>
    ({
        type: SET_NON_PERMISSIBLE_URLS,
        payload: { nonPermissibleUrls },
    } as const);

export const setPermissibleUrls = (permissibleUrls: string[]) =>
    ({
        type: SET_PERMISSIBLE_URLS,
        payload: { permissibleUrls },
    } as const);

export const setFilteredCategories = (filteredCategories: []) =>
    ({
        type: SET_FILTERED_CATEGORIES,
        payload: { filteredCategories },
    } as const);

export const setInterceptionCategories = (interceptionCategories: string[]) =>
    ({
        type: SET_INTERCEPTION_CATEGORIES,
        payload: { interceptionCategories },
    } as const);

export const setPrr2Threshold = (prr2Threshold: number) =>
    ({
        type: SET_PPR2_THRESHOLD,
        payload: { prr2Threshold },
    } as const);

export const setPrr1Limit = (prr1Limit: number) =>
    ({
        type: SET_PPR1_LIMIT,
        payload: { prr1Limit },
    } as const);

export const setExtensionEnabled = (extensionEnabled: boolean) =>
    ({
        type: SET_EXTENSION_ENABLED,
        payload: { extensionEnabled },
    } as const);

export const setEnvironment = (environment: string) =>
    ({
        type: SET_ENVIRONMENT,
        payload: { environment },
    } as const);

export const setInformEventVisitsLimit = (informEventVisitsLimit: number) =>
    ({
        type: SET_INFORM_VISIT_LIMIT,
        payload: { informEventVisitsLimit },
    } as const);

export const setInformEventTimeoutLimit = (informEventTimeoutLimit: number) =>
    ({
        type: SET_INFORM_TIMEOUT,
        payload: { informEventTimeoutLimit },
    } as const);
