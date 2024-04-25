export const defaultActivityTypes = [
    { id: 'WEB_SEARCH', name: 'WEB_SEARCH' },
    { id: 'TITLE_CLICK', name: 'TITLE_CLICK' },
    { id: 'PAGE_VISIT', name: 'PAGE_VISIT' },
    { id: 'TELL_ME_MORE', name: 'TELL_ME_MORE' },
    { id: 'LET_US_KNOW', name: 'LET_US_KNOW' },
    { id: 'TAKE_ME_BACK', name: 'TAKE_ME_BACK' },
    { id: 'MESSAGE_TEACHER', name: 'MESSAGE_TEACHER' },
    { id: 'PRR_TRIGGER', name: 'PRR_TRIGGER' },
];

export enum ActivityTypes {
    ACCESS_LIMITED = 'ACCESS_LIMITED',
    LET_US_KNOW = 'LET_US_KNOW',
    MESSAGE_TEACHER = 'MESSAGE_TEACHER',
    PAGE_VISIT = 'PAGE_VISIT',
    PRR_TRIGGER = 'PRR_TRIGGER',
    TAKE_ME_BACK = 'TAKE_ME_BACK',
    TELL_ME_MORE = 'TELL_ME_MORE',
    TITLE_CLICK = 'TITLE_CLICK',
    WEB_SEARCH = 'WEB_SEARCH',
}
