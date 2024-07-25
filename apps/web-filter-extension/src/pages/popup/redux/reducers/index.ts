import { combineReducers } from 'redux';

import { settings } from './settings';

export const rootReducer = combineReducers({
    settings,
});

export type RootState = ReturnType<typeof rootReducer>;
