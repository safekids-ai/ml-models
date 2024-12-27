import {
  setupReduxed
} from 'reduxed-chrome-storage';
import { configureStore } from '@reduxjs/toolkit';
import {rootReducer} from '@shared/redux/reducers';

export const createChromeStore = () => {
    const options = {
        storageArea: 'local',
        storageKey: 'safekids-redux-storage',
    };

  const storeCreatorContainer = (preloadedState?: any) =>
    configureStore({reducer: rootReducer, preloadedState});
  const instantiate = setupReduxed(storeCreatorContainer, options);
  const store = instantiate();
  return store;
};

export class ChromeStore {
  static createStore = async (): Promise<any> => {
    return createChromeStore();
  };
}
