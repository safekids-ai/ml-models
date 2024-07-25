import { SettingsActionTypes } from '@pages/popup/redux/actions/settings';
import { RootState } from '@pages/popup/redux/reducers';

export type ReduxStorage = {
    getState: () => RootState;
    dispatch: (action: SettingsActionTypes) => Promise<void>; // returns dispatchedAction
};
