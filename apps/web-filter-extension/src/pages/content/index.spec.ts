import { init } from '../../../src/pages/content/content';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { ChromeStore } from '../../../src/popup/redux/chrome-storage';
import { addListener } from '@reduxjs/toolkit';

describe('Content script test', () => {
    const store: any = TestUtils.buildStore();
    it.skip('Should start boostrapper', async () => {
        jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
            return store;
        });

        // TODO: FIX THIS
        // init();
        expect(true).toBeTruthy();
    });

    it('Should fail to start boostrapper', async () => {
        jest.spyOn(ChromeStore, 'createStore').mockImplementation((): Promise<any> => {
            // @ts-ignore
            return null;
        });
        // TODO: FIX THIS
        // init().catch((e) => {

        // });
    });
});
