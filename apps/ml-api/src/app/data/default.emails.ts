import { EmailTemplates } from '../email/email.templates';
import { EmailTemplateDTO } from '../email/dto/email.template.dto';
import * as path from "path";

const dirname = __dirname//path.resolve();
const TEMPLATES_PATH = dirname + '/data/email-templates/';

export const DEFAULT_EMAIL_TEMPLATES: Array<Omit<EmailTemplateDTO, '_id'>> = [
    {
        name: EmailTemplates.SignUp,
        content: {
            Subject: 'Welcome {{firstName}} {{lastName}}',
            Body: TEMPLATES_PATH + 'Signup.html',
            Text: '',
        },
    },
    {
        name: EmailTemplates.NewLoginAccount,
        content: {
            Subject: 'New Login Detected',
            Body: TEMPLATES_PATH + 'NewLoginAccount.html',
            Text: '',
        },
    },
    {
        name: EmailTemplates.CreateGuardian,
        content: {
            Subject: 'Welcome {{FirstName}} {{LastName}}',
            Body: TEMPLATES_PATH + `CreateGuardian.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.CreateUser,
        content: {
            Subject: 'Welcome to SafeKids!',
            Body: TEMPLATES_PATH + `CreateUser.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.PasswordReset,
        content: {
            Subject: 'Password Reset',
            Body: TEMPLATES_PATH + `ForgotPassword.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.EventDetected,
        content: {
            Subject: 'Event Detected',
            Body: TEMPLATES_PATH + `EventDetected.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.ServiceUninstall,
        content: {
            Subject: 'Desktop Service Uninstalled',
            Body: TEMPLATES_PATH + `ServiceUninstall.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.ParentConsent,
        content: {
            Subject: 'Information Regarding COPPA',
            Body: TEMPLATES_PATH + `ParentConsent.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.SchoolSignupRequest,
        content: {
            Subject: 'School Signup Requested',
            Body: TEMPLATES_PATH + 'SchoolSignupRequest.html',
            Text: '',
        },
    },
    {
        name: EmailTemplates.SchoolSignupVerified,
        content: {
            Subject: 'Welcome {{contactName}} for School Onboarding',
            Body: TEMPLATES_PATH + 'SchoolSignupVerified.html',
            Text: '',
        },
    },
    {
        name: EmailTemplates.PRRLevel3Alert,
        content: {
            Subject: 'Safe Kids {{category}} ALERT',
            Body: TEMPLATES_PATH + 'Level3PRRTriggered.html',
            Text: '',
        },
    },
    {
        name: EmailTemplates.CreateRootUser,
        content: {
            Subject: 'Welcome Administrator',
            Body: TEMPLATES_PATH + `CreateRootUser.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.ALERT_COACH,
        content: {
            Subject: 'Attention required',
            Body: TEMPLATES_PATH + `AlertCoach.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.ASK_PARENT,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `AskParent.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.INFORM_PARENT_URL,
        content: {
            Subject: 'Safe Kids {{kidName}} {{category}} Alert',
            Body: TEMPLATES_PATH + `InformParent.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.INFORM_PARENT_AI,
        content: {
            Subject: 'Safe Kids {{kidName}} {{category}} Alert',
            Body: TEMPLATES_PATH + `InformParentAI.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.EXTENSION_UNINSTALL,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `ExtensionUninstall.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.INFORM_EXTENSION_UNINSTALL_DISABLED,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `ExtensionUninstallDisabled.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.GMAIL_EXT_TALK_TO_ADULT,
        content: {
            Subject: 'Student Support Request - Safe Kids for Email',
            Body: TEMPLATES_PATH + `GmailTalkToAdult.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.PRR_INFORM_EVENT_EMAIL,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `InformParentVisits.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.INFORM_LEVEL_THREE_URL,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `InformLevelThreeUrl.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.INFORM_LEVEL_THREE_AI,
        content: {
            Subject: 'Safe Kids at Home Alert',
            Body: TEMPLATES_PATH + `InformLevelThreeAI.html`,
        },
    },
    {
        name: EmailTemplates.INFORM_LIMIT_ACCESS_PARENT,
        content: {
            Subject: 'Safe Kids {{kidName}} {{category}} Alert',
            Body: TEMPLATES_PATH + `InformParentLimitAccess.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.TRIAL_ENDS,
        content: {
            Subject: 'Safe Kids AI Alert- Subscription Trial Ends',
            Body: TEMPLATES_PATH + `BillingTrialEnds.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.BILLING_PAYMENT_FAILED,
        content: {
            Subject: 'Safe Kids AI Alert- Extension disabled',
            Body: TEMPLATES_PATH + `BillingPaymentFailed.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.BILLING_SUBSCRIPTION_EXPIRED,
        content: {
            Subject: 'Safe Kids AI Alert - Extension disabled',
            Body: TEMPLATES_PATH + `BillingSubscriptionExpired.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.EXTENSION_SUBSCRIPTION_EXPIRED,
        content: {
            Subject: 'Safe Kids AI Alert - Extension disabled',
            Body: TEMPLATES_PATH + `ExtensionSubscriptionExpired.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.SUBSCRIPTION_CANCEL,
        content: {
            Subject: 'Safe Kids AI Subscription Cancel',
            Body: TEMPLATES_PATH + `SubscriptionCancel.html`,
            Text: '',
        },
    },
    {
        name: EmailTemplates.SUBSCRIPTION_RENEW,
        content: {
            Subject: 'Safe Kids AI Subscription Renewal',
            Body: TEMPLATES_PATH + `SubscriptionRenew.html`,
            Text: '',
        },
    },
];
