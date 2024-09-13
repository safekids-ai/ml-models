import { combineReducers } from 'redux';

import { settings } from '@shared/redux/reducers/settings';

export const rootReducer = combineReducers({
    settings,
});

export type RootState = ReturnType<typeof rootReducer>;
