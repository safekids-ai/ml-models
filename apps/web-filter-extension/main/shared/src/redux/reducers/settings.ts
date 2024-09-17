import { PrrLevel } from '@shared/types/PrrLevel';
import { SettingsActionTypes } from '@shared/redux/actions/settings';
import {
    SET_BLOCKED_PRR_PAGE_UPDATED,
    SET_CATEGORY_PRR_THRESHOLD,
    SET_EXTENSION_ENABLED,
    SET_EXTENSION_UPDATED,
    SET_FILTER_EFFECT,
    SET_FILTER_STRICTNESS,
    SET_FILTERED_CATEGORIES,
    SET_IMAGE_ANALYZE_LIMIT,
    SET_INTERCEPTION_CATEGORIES,
    SET_LANGUAGE,
    SET_LIGHT_OFF_TIME,
    SET_ML_PROCESSLIMIT,
    SET_ML_PRR_THRESHOLD_MAX,
    SET_ML_PRR_THRESHOLD_MIN,
    SET_NLP_ANALYZE_LIMIT,
    SET_NLP_PROCESSLIMIT,
    SET_NLP_PRR_THRESHOLD_MAX,
    SET_NLP_PRR_THRESHOLD_MIN,
    SET_NON_PERMISSIBLE_URLS,
    SET_PERMISSIBLE_URLS,
    SET_PPR1_LIMIT,
    SET_PPR2_THRESHOLD,
    SET_SCHOOL_HOLIDAY,
    SET_SCHOOL_TIME,
    SET_TRAINED_MODEL,
    TOGGLE_BLOCKER,
    TOGGLE_DEBUG,
    TOGGLE_DEMO,
    TOGGLE_EXTENSION_ENABLED,
    TOGGLE_LOGGING,
    TOGGLE_NPL,
    TOGGLE_PR_TRIGGER,
    TOGGLE_RUN_ML,
    TOGGLE_SHOW_CLEAN,
    SET_ENVIRONMENT,
    SET_INFORM_VISIT_LIMIT,
    SET_INFORM_TIMEOUT,
} from '@shared/redux/actions/settings/settingsTypes';
import { PRRThreshold } from '@shared/redux/store';

export type blockPRRPageType = {
    level: string;
    category: string;
    host: string;
    fullWebUrl?: string;
    trigger?: string;
};

export type interceptTimeType = {
    startTime: string;
    endTime: string;
};

export type SettingsState = {
    logging: boolean;
    debug: boolean;
    filterEffect: 'hide' | 'blur' | 'none';
    trainedModel: 'YOLOV';
    mlEnabled: boolean;
    filterStrictness: number;
    enablePRTrigger: boolean;
    mlPRRThresholdMin: number;
    mlPRRThresholdMax: number;
    imageAnalyzeLimit: number;
    nlpEnabled: boolean;
    showClean: boolean;
    enableBlocker: boolean;
    permissibleUrls: string[];
    nonPermissibleUrls: string[];
    nlpPRRThresholdMax: number;
    nlpPRRThresholdMin: number;
    nlpAnalyzeLimit: number;
    prTriggered: boolean;
    prodEnvironment: boolean;
    mlProcessLimit: number;
    nlpProcessLimit: number;
    extensionUpdated: boolean;
    blockedPRRPage: blockPRRPageType;
    prrThresholds: {};
    prrCategoryThreshold: PRRThreshold;
    enableDemo: boolean;
    language: string;
    environment: string;
    filteredCategories: [];
    interceptionCategories: string[];
    isHoliday: boolean;
    schoolTime?: interceptTimeType;
    lightOffTime?: interceptTimeType;
    prr1Limit: number;
    prr2Threshold: number;
    extensionEnabled: boolean;
    informEventVisitsLimit: number;
    informEventTimeoutLimit: number;
};

const prrThresholdMap: any = {};

prrThresholdMap.ADULT_CONTENT = {
    category: 'ADULT_CONTENT',
    mlMin: 3,
    nlpMin: 4,
    mlMax: 4,
    nlpMax: 5,
};

prrThresholdMap.PORN = {
    category: 'PORN',
    mlMin: 2,
    nlpMin: 4,
    mlMax: 3,
    nlpMax: 5,
};
prrThresholdMap.WEAPONS = {
    category: 'WEAPONS',
    mlMin: 3,
    nlpMin: 3,
    mlMax: 5,
    nlpMax: 4,
};
prrThresholdMap.SELF_HARM = {
    category: 'SELF_HARM',
    mlMin: 1,
    nlpMin: 2,
    mlMax: 2,
    nlpMax: 3,
};
prrThresholdMap.VIOLENCE = {
    category: 'VIOLENCE',
    mlMin: 1,
    nlpMin: 1,
    mlMax: 2,
    nlpMax: 2,
};
prrThresholdMap.PROXY = {
    category: 'INTEGRITY',
    mlMin: 0,
    nlpMin: 3,
    mlMax: 0,
    nlpMax: 5,
};
const prrDefaultThreshold = prrThresholdMap.PORN;

export const initialState: SettingsState = {
    logging: process.env.NODE_ENV === 'development',
    debug: false,
    prodEnvironment: process.env.NODE_ENV !== 'development',
    environment: process.env.NODE_ENV ? process.env.NODE_ENV : 'unknown',
    filterEffect: 'none',
    trainedModel: 'YOLOV',
    mlEnabled: true,
    filterStrictness: 70,
    enablePRTrigger: true,
    mlPRRThresholdMax: 4,
    mlPRRThresholdMin: 3,
    nlpPRRThresholdMin: 4,
    nlpPRRThresholdMax: 5,
    showClean: false,
    nlpEnabled: true,
    enableBlocker: true,
    imageAnalyzeLimit: 10, // 50%
    nlpAnalyzeLimit: 30, // 50%
    prTriggered: false,
    permissibleUrls: [],
    nonPermissibleUrls: [],
    mlProcessLimit: 100,
    nlpProcessLimit: 300,
    extensionUpdated: false,
    blockedPRRPage: { level: PrrLevel.ONE, category: '', host: '' },
    prrThresholds: prrThresholdMap,
    prrCategoryThreshold: prrDefaultThreshold,
    enableDemo: false,
    language: 'en',
    prr1Limit: 3,
    prr2Threshold: 60,
    filteredCategories: [],
    interceptionCategories: ['ONLINE_GAMING', 'SOCIAL_MEDIA_CHAT'],
    isHoliday: false,
    extensionEnabled: true,
    informEventVisitsLimit: 50, //50 - 2 (clicks)
    informEventTimeoutLimit: 5, //5- 2 (clicks)
};

export function settings(state = initialState, action: SettingsActionTypes): SettingsState {
    switch (action.type) {
        case TOGGLE_LOGGING:
            return { ...state, logging: !state.logging };
        case TOGGLE_EXTENSION_ENABLED:
            return { ...state, extensionEnabled: !state.extensionEnabled };
        case SET_EXTENSION_ENABLED:
            if (action.payload.extensionEnabled) {
                return {
                    ...state,
                    enableBlocker: true,
                    enablePRTrigger: true,
                    nlpEnabled: true,
                    mlEnabled: true,
                    extensionEnabled: action.payload.extensionEnabled,
                };
            } else {
                return {
                    ...state,
                    enableBlocker: false,
                    enablePRTrigger: false,
                    nlpEnabled: false,
                    mlEnabled: false,
                    extensionEnabled: action.payload.extensionEnabled,
                };
            }
        case TOGGLE_DEMO:
            //TODO: remove 'side-effect' to reducer
            chrome.storage.local.set({ demoEnabled: !state.enableDemo }, function () {});
            return { ...state, enableDemo: !state.enableDemo };
        case TOGGLE_DEBUG:
            //TODO: remove 'side-effect' to reducer
            chrome.runtime.sendMessage({ type: 'TOGGLE_DEBUG', value: !state.debug });
            return { ...state, debug: !state.debug };
        case SET_CATEGORY_PRR_THRESHOLD:
            prrThresholdMap[action.payload.prrThreshold.category] = action.payload.prrThreshold;
            return {
                ...state,
                prrCategoryThreshold: action.payload.prrThreshold,
                prrThresholds: prrThresholdMap,
            };
        case TOGGLE_RUN_ML:
            return { ...state, mlEnabled: !state.mlEnabled };
        case SET_FILTER_EFFECT:
            return { ...state, filterEffect: action.payload.filterEffect };
        case SET_TRAINED_MODEL:
            return { ...state, trainedModel: action.payload.trainedModel };
        case SET_FILTER_STRICTNESS:
            return { ...state, filterStrictness: action.payload.filterStrictness };
        case TOGGLE_PR_TRIGGER:
            return { ...state, enablePRTrigger: !state.enablePRTrigger };
        case SET_ML_PRR_THRESHOLD_MAX:
            return { ...state, mlPRRThresholdMax: action.payload.mLprrThresholdMax };
        case TOGGLE_NPL:
            return { ...state, nlpEnabled: !state.nlpEnabled };
        case TOGGLE_SHOW_CLEAN:
            return { ...state, showClean: !state.showClean };
        case TOGGLE_BLOCKER:
            return { ...state, enableBlocker: !state.enableBlocker };
        case SET_NLP_ANALYZE_LIMIT:
            return { ...state, nlpAnalyzeLimit: action.payload.nlpAnalyzeLimit };
        case SET_IMAGE_ANALYZE_LIMIT:
            return { ...state, imageAnalyzeLimit: action.payload.imageAnalyzeLimit };
        case SET_ML_PRR_THRESHOLD_MIN:
            return { ...state, mlPRRThresholdMin: action.payload.mlPrrThresholdMin };
        case SET_NLP_PRR_THRESHOLD_MIN:
            return {
                ...state,
                nlpPRRThresholdMin: action.payload.nlpPrrThresholdMin,
            };
        case SET_NLP_PRR_THRESHOLD_MAX:
            return {
                ...state,
                nlpPRRThresholdMax: action.payload.nlpPrrThresholdMax,
            };
        case SET_PERMISSIBLE_URLS:
            return { ...state, permissibleUrls: action.payload.permissibleUrls };
        case SET_NON_PERMISSIBLE_URLS:
            return {
                ...state,
                nonPermissibleUrls: action.payload.nonPermissibleUrls,
            };
        case SET_NLP_PROCESSLIMIT:
            return { ...state, nlpProcessLimit: action.payload.nlpProcessLimit };
        case SET_ML_PROCESSLIMIT:
            return { ...state, mlProcessLimit: action.payload.mlProcessLimit };
        case SET_EXTENSION_UPDATED:
            return { ...state, extensionUpdated: action.payload.extensionUpdated };
        case SET_BLOCKED_PRR_PAGE_UPDATED:
            return { ...state, blockedPRRPage: action.payload.blockedPRRPage };
        case SET_LANGUAGE:
            return { ...state, language: action.payload.language };
        case SET_FILTERED_CATEGORIES:
            return {
                ...state,
                filteredCategories: action.payload.filteredCategories,
            };
        case SET_INTERCEPTION_CATEGORIES:
            return {
                ...state,
                interceptionCategories: action.payload.interceptionCategories,
            };
        case SET_SCHOOL_HOLIDAY:
            return { ...state, isHoliday: action.payload.isHoliday };
        case SET_SCHOOL_TIME:
            return { ...state, schoolTime: action.payload.schoolTime };
        case SET_LIGHT_OFF_TIME:
            return { ...state, lightOffTime: action.payload.lightOffTime };
        case SET_PPR1_LIMIT:
            return { ...state, prr1Limit: action.payload.prr1Limit };
        case SET_PPR2_THRESHOLD:
            return { ...state, prr2Threshold: action.payload.prr2Threshold };
        case SET_ENVIRONMENT:
            return { ...state, environment: action.payload.environment };
        case SET_INFORM_VISIT_LIMIT:
            return { ...state, informEventVisitsLimit: action.payload.informEventVisitsLimit };
        case SET_INFORM_TIMEOUT:
            return { ...state, informEventTimeoutLimit: action.payload.informEventTimeoutLimit };
        default:
            return state;
    }
}
