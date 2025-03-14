import { CategoryStatus } from './category.status';

export const defaultCategories = [
    {
        id: 'ALCOHOL',
        name: 'Alcohol',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.ASK,
        timeDuration: 30,
    },
    {
        id: 'CRITICAL_THINKING',
        name: 'Critical Thinking',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'DRUGS',
        name: 'Drugs',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'GAMING',
        name: 'Gaming',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'ILLEGAL_ACTIVITY',
        name: 'Illegal Activity',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'INTEGRITY',
        name: 'Integrity',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'EXPLICIT',
        name: 'Explicit',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'TOBACCO',
        name: 'Tobacco',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'SOCIAL_NETWORKING',
        name: 'Social Networking',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.ASK,
    },
    {
        id: 'SITUATIONAL_AWARENESS',
        name: 'Situational Awareness',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.INFORM,
    },
    {
        id: 'SELF_HARM',
        name: 'Self-Harm',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'PERMISSIBLE',
        name: 'Permissible',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'ACCESS_LIMITED',
        name: 'Access Limited',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'SEARCH_ENGINES',
        name: 'Search Engines',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'SHOPPING',
        name: 'Shopping',
        enabled: false,
        schoolDefault: false,
        editable: false,
        status: CategoryStatus.PREVENT,
    },

    {
        id: 'ENTERTAINMENT_NEWS_STREAMING',
        name: 'Entertainment News and Streaming',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'ONLINE_GAMING',
        name: 'Online Gaming',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
        timeDuration: 30,
    },
    {
        id: 'SEX_EDUCATION',
        name: 'Sex Education',
        enabled: true,
        schoolDefault: true,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'SOCIAL_MEDIA_CHAT',
        name: 'Social Media and Chat',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'CLOTHING_FASHION_JEWELRY',
        name: 'Clothing, Fashion and Jewelry',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'SHOPPING_PRODUCT_REVIEWS',
        name: 'Shopping and Product Reviews',
        enabled: true,
        schoolDefault: true,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'ADULT_SEXUAL_CONTENT',
        name: 'Adult Sexual Content',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'BODY_IMAGE',
        name: 'Body Image/Related to Disordered Eating',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'CRIMINAL_MALICIOUS',
        name: 'Criminal/Malicious',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'DRUGS_ALCOHOL_TOBACCO',
        name: 'Drugs, Alcohol, or Tobacco Related',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'FAKE_NEWS',
        name: 'Fake News',
        enabled: false,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'GAMBLING',
        name: 'Gambling',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'HATE_SPEECH',
        name: 'Hate Speech',
        enabled: false,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'INAPPROPRIATE_FOR_MINORS',
        name: 'Inappropriate for Minors',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'SELF_HARM_SUICIDAL_CONTENT',
        name: 'Self Harm/Suicidal Content',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
    {
        id: 'VIOLENCE',
        name: 'Violence',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.PREVENT,
    },
    {
        id: 'WEAPONS',
        name: 'Weapons',
        enabled: true,
        schoolDefault: false,
        editable: true,
        status: CategoryStatus.ALLOW,
    },
];

export enum Categories {
    ALCOHOL = 'ALCOHOL',
    BODY_IMAGE = 'BODY_IMAGE',
    CRITICAL_THINKING = 'CRITICAL_THINKING',
    GAMBLING = 'GAMBLING',
    GAMING = 'GAMING',
    ILLEGAL_ACTIVITY = 'ILLEGAL_ACTIVITY',
    INTEGRITY = 'INTEGRITY',
    EXPLICIT = 'EXPLICIT',
    TOBACCO = 'TOBACCO',
    SOCIAL_NETWORKING = 'SOCIAL_NETWORKING',
    SITUATIONAL_AWARENESS = 'SITUATIONAL_AWARENESS',
    WEAPONS = 'WEAPONS',
    SELF_HARM = 'SELF_HARM',
    PERMISSIBLE = 'PERMISSIBLE',
    ACCESS_LIMITED = 'ACCESS_LIMITED',
    SEARCH_ENGINES = 'SEARCH_ENGINES',
    SHOPPING = 'SHOPPING',
}
