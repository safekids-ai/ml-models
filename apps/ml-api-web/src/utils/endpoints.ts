const PREFIX = 'v1';
const NEW_PREFIX = 'v2';

export const CHANGE_PASSWORD = `user/${PREFIX}/reset-password`;

export const COPPA_CONSENT = `/user/${PREFIX}/record-parent-consent`;
export const DELETE_ACCOUNT = `/user/${PREFIX}/delete-account`;
export const ADD_KID = `kid/${PREFIX}/create-kid`;
export const UPDATE_KID = `kid/${PREFIX}/update-kid`;
export const DELETE_KID = `kid/${PREFIX}/delete-kid`;
export const GET_KIDS = `kid/${PREFIX}/get-kids`;
export const ADD_USER = `user/${PREFIX}/create-user`;
export const DELETE_USER = `user/${PREFIX}/delete-user`;
export const UPDATE_USER = `user/${PREFIX}/update-user`;
export const GET_USERS = `user/${PREFIX}/get-users`;

export const GET_DEVICES = `device/${PREFIX}/get-devices`;
export const DELETE_DEVICE = `device/${PREFIX}/delete-device`;

export const CREATE_DEVICE_LINK = `device/${PREFIX}/create-device-kid-link`;
export const DELETE_DEVICE_LINK = `device/${PREFIX}/delete-device-kid-link`;

export const GET_NOTIFICATIONS = `notification/${PREFIX}/get-notifications`;
export const UPDATE_NOTIFICATIONS_STATUS = `notification/${PREFIX}/update-notifications-status`;

export const CHECK_IF_KIDS_EXIST = `kid/${PREFIX}/check-if-kids-exist`;

export const GET_USER_PROFILE = `user/${PREFIX}/get-user-profile`;

export const GET_EVENTS = `event/${PREFIX}/get-events`;
export const GET_GROUPED_EVENTS = `event/${PREFIX}/get-grouped-events`;
export const DELETE_EVENTS = `event/${PREFIX}/delete-events`;
export const GET_SCREEN_EVENTS = `event/${PREFIX}/get-all-screen-events`;

export const EVENT_FEEDBACK = `event/${PREFIX}/provide-event-feedback`;

export const UPDATE_PROFILE = `user/${PREFIX}/update-profile-user-info`;

export const ENABLE_2FA = `user/${PREFIX}/verify-2fa`;
export const VERIFY_2FA = `user/${PREFIX}/verify-2fa-code`;
export const DISABLE_2FA = `user/${PREFIX}/disable-2fa`;

export const E2E_HEARTBEAT = `health/check-e2e`;
export const API_HEARTBEAT = `health/check`;

export const DOWNLOAD_INSTALLER = `device/${PREFIX}/get-latest-installer-download-info/`;

export const GET_CATEGORIES_LIST = `categories/${PREFIX}/list`;
export const SAVE_KID_CATEGORIES = `kid/${PREFIX}/categories`;

export const GET_EVENT_ACTIVITY = `event/${PREFIX}/get-activity`;
export const GET_EVENT_ACTIVITY_TIMELINE = `event/${PREFIX}/get-activity-timeline`;

export const SAVE_KID_EXCEPTIONS = `kid/${PREFIX}/exceptions`;
export const SAVE_KID_EXEMPTED_PROGRAMS = `kid/${PREFIX}/excluded-apps`;

export const GET_SERVICES_LIST = `applicationServices/${PREFIX}/list`;

export const SCHOOL_SIGNUP_REQUEST = `school/${PREFIX}/signup`;

export const GET_SCHOOL = `school/${PREFIX}/school`;
export const SAVE_SCHOOL_CATEGORIES = `school/${PREFIX}/categories`;
export const SAVE_SCHOOL_EXCEPTIONS = `school/${PREFIX}/url-filter`;
export const UPDATE_SCHOOL_USER_SIGNUP = `school/${PREFIX}/signup-user`;
export const GET_REQUESTED_USER = `user/${PREFIX}/verify-token`;
export const VERIFY_USER_ACCOUNT = `/user/${PREFIX}/verify-account`;

export const KIDS_ACTIVITY = `/kid/${PREFIX}/activity`;

// School Portal
export const GET_EMERGENCY_CONTACT = `v2/directory/accounts/emergencycontact`;
export const PATCH_EMERGENCY_CONTACT = `v2/directory/accounts/emergencycontact`;
export const GET_ONBOARDING_CATEGORIES = `v2/webfilter/categories`;
export const GET_ONBOARDING_URLS = `v2/webfilter/urls`;
export const GET_ONBOARDING_ORGUNITS = `v2/directory/orgunits`;
export const POST_ONBOARDING_URLS = `v2/webfilter/filteredurls/orgunits`;
export const POST_ONBOARDING_CATEGORIES = `v2/webfilter/filteredcategories/orgunits`;
export const GET_GOOGLE_AUTH = `auth/google`;
export const GET_NOTIFICATION_ACTIVITIES_MESSAGES = `${NEW_PREFIX}/webusage/activities/messages`;
export const UPDATE_USER_ACCESS = `${NEW_PREFIX}/directory/users/{userId}/access`;
export const POST_STUDENT_INFORMATION = `v2/config/accounts/apikeys`;
export const POST_NON_SCHOOL_DAYS = `v2/accounts/nonschooldays/bulk`;
export const POST_NON_SCHOOL_DAYS_CONFIG = `v2/config/accounts/nonschooldays`;
export const PATCH_INTERCEPTION_CATEGORIES = `v2/directory/accounts/interception-categories/`;
export const POST_INTERCEPTION_TIME = `v2/accounts/interception-times`;
export const GET_ONBOARDING_STATUS = `v2/directory/accounts/onboardingstatus`;
export const UPDATE_ONBOARDING_STEP = `v2/directory/accounts/onboarding-step`;
export const GET_TOP_5_INTERCEPTED_CATEGORIES = `v2/insights/dashboard/aggregated/categories`;
export const GET_TOP_5_INTERCEPTED_URL = `v2/insights/dashboard/aggregated/urls`;
export const GET_CASUAL_ENGAGEMENT = `v2/insights/dashboard/aggregated/interceptions`;
export const GET_TOP_INTERCEPT = `v2/insights/dashboard/interceptions/top`;
export const SCHOOL_KID = `v2/consumer/user`;
export const GET_GMAIL_REPORTS = `v2/insights/dashboard/reports/gmail`;

export const GET_ACCESS_LIMITED_USERS = `v2/insights/dashboard/users/accesslimited`;
export const GET_CRISIS_ENGAGEMENT = `v2/insights/dashboard/users/crises`;
export const GET_NON_INTERCEPT_REPORT = `v2/insights/dashboard/reports/urls/notintercepted`;
export const POST_FILTERED_URL_DISABLE = `v2/webfilter/filteredurls/accounts`;
export const GET_SCHOOL_USER_PROFILE = `v2/directory/users/profile`;
export const UPDATE_STUDENT_INFORMATION = `v2/config/accounts/apikeys/{id}`;
export const GET_STUDENT_INFORMATION = `v2/config/accounts/apiKeys`;
export const GET_NON_SCHOOL_DAYS = `v2/accounts/nonschooldays`;
export const GET_NON_SCHOOL_DAYS_CONFIG = `v2/config/accounts/nonschooldays`;
export const GET_INTERCEPTION_TIMES = `v2/accounts/interception-times`;
export const GET_INTERCEPTION_CATEGORIES = `v2/directory/accounts/interception-categories`;
export const GET_VERIFY_TOKEN_CRISIS_MANAGEMENT = `v2/crisis-management/verify-token`;
export const UPDATE_JOB_STATUS = `v2/jobs/org-units`;
export const GET_JOB_STATUS = `v2/jobs/org-units/{jobId}/status`;
export const NON_SCHOOL_DEVICES_CONFIG = `v2/config/accounts/non-school-devices`;
export const GET_SEARCH_AUTOCOMPLETE = `v2/webusage/activities/search/autocomplete`;
export const GET_SEARCH_STUDENTS = `v2/webusage/activities/search/students`;
export const GET_DOWNLOAD_ACTIVITY = `v2/webusage/activities/download/activity`;

// Consumer Portal
export const LOGIN = `v2/consumer/auth/login`;
export const SIGNUP = `v2/consumer/auth/sign-up`;
export const SIGNUP_VERIFY = `v2/consumer/auth/verify-email`;
export const RESEND_SIGNUP_CODE = `v2/consumer/auth/resend-email-code`;
export const FORGOT_PASSWORD = `v2/consumer/auth/forgot-password`;
export const UPDATE_FORGOT_PASSWORD = `v2/consumer/auth/reset-password`;
export const VERIFY_PASSWORD_RESET_CODE = `v2/consumer/auth/verify-code`;
export const POST_COPPA_CONSENT = `v2/consumer/user/parent-consent`;
export const GET_CONSUMER_KIDS = `v2/consumer/user/kids`;
export const PUT_KID_ASK_ACCESS_REQUEST = `v2/kid-request/bulk`;
export const PUT_UPDATE_LIMIT_ACCESS_REQUEST = `v2/kid-request/access-update`;
export const CONSUMER_KID = `v2/consumer/user`;
export const GET_ACCOUNT_TYPE = `v2/directory/accounts/account-type`;
export const PUT_KID_REQUEST = `v2/kid-request`;
export const GET_FILTERED_CATEGORIES = `v2/directory/orgunits/filtered-categories`;
export const PUT_FILTERED_CATEGORIES = `v2/directory/orgunits/filtered-categories`;
export const GET_FILTERED_WEBSITES = `v2/directory/orgunits/filtered-urls`;
export const POST_FILTERED_WEBSITES = `v2/directory/orgunits/filtered-urls`;
export const DELETE_FILTERED_WEBSITES = `v2/directory/orgunits/filtered-urls`;
export const GET_FILTERED_PROCESS = `v2/webfilter/filtered-process`;
export const POST_FILTERED_PROCESS = `v2/webfilter/filtered-process`;
export const DELETE_FILTERED_PROCESS = `v2/webfilter/filtered-process`;
//e2e test cases
export const DELETE_AN_ACCOUNT = `v2/consumer/user/delete-account`;

// billing
export const GET_PLANS = `v2/billing/plans`;
export const GET_USER_PLAN = `v2/billing/plans/current`;
export const UPDATE_USER_PLAN = `v2/billing/subscriptions`;

// paymentMethod

export const INIT_PAYMENT_METHOD = `v2/billing/init-payment`;
export const SAVE_PAYMENT_METHOD = `v2/billing/payment-method`;
export const GET_PAYMENT_METHOD = `v2/billing/payment-method`;

// coupon
export const GET_PROMO_CODE = `v2/billing/customers/promotioncodes`;
export const VERIFY_PROMO_CODE = `v2/billing/promotioncodes`;
