export const onBoardingSteps = {
    CATEGORIES: 1,
    WEBSITES: 2,
    SIS: 3,
    SCHOOL_SCHEDULE: 4,
    INTERCEPTION_TIME: 5,
    CRISIS_MANAGEMENT: 6,
};

export const ONBOARDING_IN_PROGRESS = 'IN_PROGRESS';
export const ONBOARDING_COMPLETED = 'COMPLETED';

export const StepDescription = [
    'Our settings are defaulted to a set of recommendations but please feel free to configure those settings.',
    'Our settings are defaulted to a set of recommendations but please feel free to configure those settings.',
    'This screen helps you connect your Student Information System to our tool.',
    'Please confirm your schools schedule.',
    'This screen allows you to make choices about interception time for kids',
    'This screen displays the people responsible for kids who engage in online behavior that our system identifies as self-harm or harming others. We call this Crisis Engagement.',
];

export const FeatureDescriptions = {
    categoriesApplyAll:
        'By clicking on ‘APPLY TO ALL’ and confirming, all Organizational Units will use the same category settings across your organization. Use this to have the same category filters active across every account in your organization.',
    websitesApplyAll:
        'By clicking on ‘APPLY TO ALL’ and confirming, all Organizational Units will have the same allowed websites across all accounts in your organization. Use this to have the same website access active across every account in your organization.',
    sis: 'Your Student Identification System (SIS) maps all of your accounts with Safe Kids. By providing the URL, Access Key, and Secret Code, Safe Kids will be able to access your SIS, while making sure we’re sending the right content for each student, teacher, principal, and admin at the right times.',
    categoriesUsePrevious:
        'By unchecking this checkbox, you have the ability to set the categories for this Organizational Unit. Uncheck and use this to customize category filters on specific levels within your organization. For example, one school may allow gaming, while all other schools do not. At any time, you can check this checkbox to follow the previous level’s setting.',
    websitesUsePrevious:
        'By unchecking this checkbox, you have the ability to set allowed websites for this Organizational Unit. Uncheck and use this to customize allowed websites on specific accounts within your organization. At any time, you can check this checkbox to follow the previous level’s setting.',
};
