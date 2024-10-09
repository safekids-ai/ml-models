import {PrrAsk} from '@shared/types/PrrAsk.type';
import {PrrInform} from '@shared/types/PrrInform.type';
import {FilteredCategory} from '@shared/types/FilteredCategory.type';
import {PredictionRequest} from '@shared/types/messages';
import {UserProfile} from '@shared/types/UserProfile.type';
import {PrrLevel} from '@shared/types/PrrLevel';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrInformAI} from '@shared/types/PrrInformAI';
import {PrrCrisis} from '@shared/types/PrrCrisis.type';

export enum BROWSERS {
  CHROME = 'CHROME',
  EDGE = 'EDGE',
}

export type Credentials = {
  accessCode?: string;
};

export enum EventType {
  ACCESS_LIMITED = 'ACCESS_LIMITED',
  LET_US_KNOW = 'LET_US_KNOW',
  MESSAGE_TEACHER = 'MESSAGE_TEACHER',
  PAGE_VISIT = 'PAGE_VISIT',
  PRR_TRIGGER = 'PRR_TRIGGER',
  TAKE_ME_BACK = 'TAKE_ME_BACK',
  TELL_ME_MORE = 'TELL_ME_MORE',
  TITLE_CLICK = 'TITLE_CLICK',
  WEB_SEARCH = 'WEB_SEARCH',
  LOGIN = 'LOGIN',
  SET_EXTENSION_STATUS = 'SET_EXTENSION_STATUS',
  LIMIT_ACCESS = 'LIMIT_ACCESS',
  DELETE_EXTENSION = 'DELETE_EXTENSION',
  REVOKE_ACCESS = 'REVOKE_ACCESS',
  GET_PARENT_LIST = 'GET_PARENT_LIST',
  REPORT_NOTIFICATION = 'REPORT_NOTIFICATION',
  CLOSE_TAB = 'CLOSE_TAB',
  REDIRECT = 'REDIRECT',
  PING = 'PING',
  GET_ALLOWED_HOST_LIST = 'GET_ALLOWED_HOST_LIST',
  ANALYZE_IMAGE = 'ANALYZE_IMAGE',
  ANALYZE_TEXT = 'ANALYZE_TEXT',
  ANALYZE_META = 'ANALYZE_META',
  CHECK_HOST = 'CHECK_HOST',
  ENABLE_EXTENSION = 'ENABLE_EXTENSION',
  GET_ONBOARDING_STATUS = 'GET_ONBOARDING_STATUS',
  SAVE_ONBOARDING_STATUS = 'SAVE_ONBOARDING_STATUS',
  REQUEST_CREDENTIALS_AFTER_UPDATE = 'REQUEST_CREDENTIALS_AFTER_UPDATE',
  REQUEST_CREDENTIALS = 'REQUEST_CREDENTIALS',
  UPDATE_CREDENTIALS_AFTER_UPDATE = 'UPDATE_CREDENTIALS_AFTER_UPDATE',
  UPDATE_CREDENTIALS = 'UPDATE_CREDENTIALS',
  UPDATE_CATEGORIES = 'UPDATE_CATEGORIES',
  UPDATE_CATEGORIES_TIME = 'UPDATE_CATEGORIES_TIME',
  PRR_INFORM_ACTION = 'PRR_INFORM_ACTION',
  PRR_INFORM_AI_ACTION = 'PRR_INFORM_AI_ACTION',
  PRR_REMOVE_AI_SCREEN = 'PRR_REMOVE_AI_SCREEN',
  PRR_ASK_ACTION = 'PRR_ASK_ACTION',
  PRR_CRISIS_ACTION = 'PRR_CRISIS_ACTION',
  END_TAB_EVENT = 'END_TAB_EVENT',
}

export enum PrrTrigger {
  AI_NLP = 'AI-NLP',
  AI_NLP_VISION = 'AI-NLP-VISION',
  AI_VISION = 'AI-VISION',
  AI_WEB_CATEGORY = 'AI-WEB-CATEGORY',
  URL_INTERCEPTED = 'URL-INTERCEPTED'
}

type Event = {
  text?: string;
  prrLevelId?: PrrLevel;
  host?: string;
  category?: PrrCategory;
  fullWebUrl?: string;
  browser?: string;
};

type GetOnboardingParentList = {
  type: EventType.GET_PARENT_LIST;
} & Event;

type GetAllowedHostList = {
  type: EventType.GET_ALLOWED_HOST_LIST;
} & Event;

type CloseTab = {
  type: 'CLOSE_TAB';
} & Event;

type endEvent = {
  type: 'END_TAB_EVENT';
} & Event;

type Ping = {
  type: 'PING';
} & Event;
export type IEventData = {
  title: string;
  url: string;
  type: EventType;
} & Event;

export type IKid = {
  id?: any | null;
  name: string;
} & Event;

type TitleClick = {
  type: EventType.TITLE_CLICK;
  title: string;
  href: string;
  host: string;
} & Event;

type WebSearch = {
  type: EventType.WEB_SEARCH;
  href: string;
  title?: string;
} & Event;

type ShowData = {
  type: 'SHOW_DATA';
  data: any;
} & Event;

type blockUrls = {
  type: 'BLOCK_URLS';
  value: boolean;
} & Event;

type imageThreshold = {
  type: 'IMAGE_THRESHOLD';
  value: number;
} & Event;

type nlpThreshold = {
  type: 'NLP_THRESHOLD';
  value: number;
} & Event;

type imageThresholdUI = {
  type: 'IMAGE_THRESHOLD_UI';
  value: number;
} & Event;

type deleteExtension = {
  type: EventType.DELETE_EXTENSION;
  value: boolean;
} & Event;

type enableLimitAccess = {
  category: PrrCategory;
  host: string;
  type: 'LIMIT_ACCESS';
  value: boolean;
} & Event;

type revokeAccess = {
  type: EventType.REVOKE_ACCESS;
  value: boolean;
} & Event;

type nlpThresholdUI = {
  type: 'NLP_THRESHOLD_UI';
  value: number;
} & Event;

type CheckHost = {
  type: 'CHECK_HOST';
} & Event;

export type PRRTriggerEvent = {
  type: EventType.PRR_TRIGGER;
  keyword: string;
  data: any;
  prrTriggerId?: string;
} & Event;

type redirect = {
  type: 'REDIRECT';
  source: string;
  browser: string;
  level: PrrLevel;
} & Event;

type toggleDebug = {
  type: 'TOGGLE_DEBUG';
  value: boolean;
} & Event;
type reportNotification = {
  type: 'REPORT_NOTIFICATION';
  teacherId: string;
  messages: any[];
  category: PrrCategory;
  prrLevelId: PrrLevel;
} & Event;

export type TellMeMoreEvent = {
  type: EventType.TELL_ME_MORE;
} & Event;

export type TakeMeBackEvent = {
  type: EventType.TAKE_ME_BACK;
} & Event;

export type LetUsKnowEvent = {
  type: EventType.LET_US_KNOW;
  browser: string;
} & Event;

type PageVisit = {
  type: EventType.PAGE_VISIT;
  title: string;
} & Event;

export type LoginData = {
  type: EventType.LOGIN;
  payload?: UserProfile;
  accessCode?: string;
} & Event;
export type setExtensionStatus = {
  type: EventType.SET_EXTENSION_STATUS;
  value: boolean;
} & Event;

export type analyzeImage = {
  type: EventType.ANALYZE_IMAGE;
  value: PredictionRequest;
} & Event;
export type analyzeText = {
  type: EventType.ANALYZE_TEXT;
  value: PredictionRequest;
} & Event;
export type analyzeMeta = {
  type: EventType.ANALYZE_META;
  value: PredictionRequest;
} & Event;

export type enableExtension = {
  type: EventType.ENABLE_EXTENSION;
} & Event;

export type GetOnBoardingStatus = {
  type: EventType.GET_ONBOARDING_STATUS;
} & Event;

export type SaveOnBoardingStatus = {
  type: EventType.SAVE_ONBOARDING_STATUS;
  status: string;
  step: number;
} & Event;

export type UpdateCategories = {
  type: EventType.UPDATE_CATEGORIES;
  category: FilteredCategory;
} & Event;

export type UpdateCategoriesTime = {
  type: EventType.UPDATE_CATEGORIES_TIME;
  categories: FilteredCategory[];
  offtime: string;
} & Event;

export type PrrInformAIAction = {
  type: EventType.PRR_INFORM_AI_ACTION;
  payload: PrrInformAI;
} & Event;

export type PrrRemoveAIScreen = {
  type: EventType.PRR_REMOVE_AI_SCREEN;
  payload: PrrInformAI;
} & Event;

export type PrrInformAction = {
  type: EventType.PRR_INFORM_ACTION;
  payload: PrrInform;
} & Event;

export type PrrAskAction = {
  type: EventType.PRR_ASK_ACTION;
  payload: PrrAsk;
} & Event;

export type PrrCrisisAction = {
  type: EventType.PRR_CRISIS_ACTION;
  payload: PrrCrisis;
} & Event;

export type MessageTypes =
  | LetUsKnowEvent
  | CheckHost
  | TellMeMoreEvent
  | CloseTab
  | TitleClick
  | ShowData
  | WebSearch
  | blockUrls
  | setExtensionStatus
  | imageThreshold
  | nlpThreshold
  | imageThresholdUI
  | Ping
  | deleteExtension
  | enableLimitAccess
  | revokeAccess
  | GetOnboardingParentList
  | GetAllowedHostList
  | PageVisit
  | nlpThresholdUI
  | PRRTriggerEvent
  | redirect
  | toggleDebug
  | reportNotification
  | TakeMeBackEvent
  | LoginData
  | analyzeImage
  | analyzeText
  | analyzeMeta
  | enableExtension
  | GetOnBoardingStatus
  | SaveOnBoardingStatus
  | UpdateCategories
  | UpdateCategoriesTime
  | PrrInformAIAction
  | PrrRemoveAIScreen
  | PrrInformAction
  | PrrAskAction
  | PrrCrisisAction
  | endEvent;
