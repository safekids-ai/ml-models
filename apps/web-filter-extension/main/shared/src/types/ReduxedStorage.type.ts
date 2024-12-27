import { SettingsActionTypes } from '@shared/redux/actions/settings';
import { RootState } from '@shared/redux/reducers';

export type ReduxStorage = {
    getState: () => RootState;
    dispatch: (action: SettingsActionTypes) => Promise<void>; // returns dispatchedAction
};
