const PREFIX = 'v2/chrome';
export const CHROME_EXTENSION_LOGIN = `${PREFIX}/consumer/auth/login`;
export const GET_EXTENSION_CONFIGURATION = `${PREFIX}/consumer/api/webfilter/configuration`;
export const GET_PARENTS_LIST = `${PREFIX}/api/consumer/home/parent`;
export const SAVE_ACTIVITY = `${PREFIX}/api/webusage/activities`;
export const SAVE_VISITS = `${PREFIX}/api/webusage/visits`;
export const SAVE_FEEDBACK = `${PREFIX}/api/webusage/activities/feedback`;
export const SAVE_CHROME_USAGE = `${PREFIX}/api/webusage/webtime`;
export const LIMIT_ACCESS_URI = `${PREFIX}/consumer/api/users/accesslimited`;

export const GET_ONBOARDING_STATUS = `${PREFIX}/consumer/onboard-status`;
export const SAVE_ONBOARDING_STATUS = `${PREFIX}/consumer/onboard-status`;

export const UPDATE_CATEGORIES = `${PREFIX}/consumer/categories`;
export const UPDATE_CATEGORIES_TIME = `${PREFIX}/consumer/categories-time`;

export const PRR_INFORM_AI_PARENT = `${PREFIX}/consumer/inform-parent`;
export const PRR_INFORM_PARENT = `${PREFIX}/consumer/inform-parent`;
export const PRR_ASK_PARENT = `${PREFIX}/consumer/ask-parent`;

export const PRR_CRISIS_AI_INFORM = `${PREFIX}/consumer/inform-ai-crisis`;

export const PRR_INFORM_EXT_DISABLE = `${PREFIX}/consumer/ext-uninstall-inform`;
export const PRR_CANCEL_EXT_DISABLE = `${PREFIX}/consumer/ext-uninstall-cancel`;

export const GET_CATEGORY_FROM_HOST = `v2/web-category`;

