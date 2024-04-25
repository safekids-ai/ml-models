export enum PrrUserAction {
    MESSAGE_ACTION_YES_PLEASE = 'MESSAGE_ACTION_YES_PLEASE',
    MESSAGE_ACTION_NO_LEAVE_IT_OPEN = 'MESSAGE_ACTION_NO_LEAVE_IT_OPEN',
    COMPOSE_ACTION_YES_ITS_FINE = 'COMPOSE_ACTION_YES_ITS_FINE',
    COMPOSE_ACTION_NO_TRY_AGAIN = 'COMPOSE_ACTION_NO_TRY_AGAIN',
    MESSAGE_ACTION_TALK_TO_ADULT = 'MESSAGE_ACTION_TALK_TO_ADULT',
    THREAD_ACTION_ITS_UNKIND = 'THREAD_ACTION_ITS_UNKIND',
    THREAD_ACTION_ITS_FINE = 'THREAD_ACTION_ITS_FINE',
    MESSAGE_ACTION_YES = 'MESSAGE_ACTION_YES',
    MESSAGE_ACTION_NO = 'MESSAGE_ACTION_NO',
}
export const defaultPrrAction = [
    { id: PrrUserAction.MESSAGE_ACTION_YES_PLEASE, action: 'Yes, Please' },
    { id: PrrUserAction.MESSAGE_ACTION_NO_LEAVE_IT_OPEN, action: 'No, leave it open' },
    { id: PrrUserAction.MESSAGE_ACTION_TALK_TO_ADULT, action: "I'll talk to an adult" },
    { id: PrrUserAction.COMPOSE_ACTION_YES_ITS_FINE, action: "Yes, it's fine" },
    { id: PrrUserAction.COMPOSE_ACTION_NO_TRY_AGAIN, action: 'No, let me try again' },
    { id: PrrUserAction.THREAD_ACTION_ITS_UNKIND, action: "Yes, it's unkind" },
    { id: PrrUserAction.THREAD_ACTION_ITS_FINE, action: "No, it's fine" },
    { id: PrrUserAction.MESSAGE_ACTION_YES, action: 'Yes' },
    { id: PrrUserAction.MESSAGE_ACTION_NO, action: 'No' },
];
