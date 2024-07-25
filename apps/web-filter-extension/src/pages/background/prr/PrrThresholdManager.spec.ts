import { PrrThresholdManager, ThresholdManagerFactory } from '../../../../src/pages/background/prr/PrrThresholdManager';
import { ReduxStorage } from '../../../../src/shared/types/ReduxedStorage.type';
import { jest } from '@jest/globals';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';

class Fixture {
    static buildSettingsState(category: string) {
        return {
            getState: jest.fn().mockReturnValueOnce({
                settings: {
                    prrThresholds: this.buildThresholdMap(category),
                },
            }),
            dispatch: jest.fn(),
        } as ReduxStorage;
    }

    private static buildThresholdMap(category: string) {
        const prrThresholdMap = {};
        // TODO: this needs to have fixed set of keys that we can define, which are categories, this is implicit any
        // @ts-ignore
        prrThresholdMap[category] = {
            category: category,
            mlMin: 1,
            nlpMin: 2,
            mlMax: 3,
            nlpMax: 4,
        };
        return prrThresholdMap;
    }
}

describe('Prr threshold manager test', () => {
    describe('Get threshold manager instance', () => {
        it('Should get default threshold manager instance and return trigger status', async () => {
            //given
            const category = 'some-category';
            const state = Fixture.buildSettingsState(category);

            //when
            const instance = ThresholdManagerFactory.getManager(category, state);

            const shouldTrigger = instance.shouldTrigger(5, 5);

            //then
            expect(instance instanceof PrrThresholdManager).toBeTruthy();
            expect(shouldTrigger).toBeTruthy();
        });

        it('Should get explicit threshold manager instance and return trigger status', async () => {
            //given
            const category = PrrCategory.EXPLICIT;
            const state = Fixture.buildSettingsState(category);

            //when
            const instance = ThresholdManagerFactory.getManager(category, state);

            const shouldTrigger = instance.shouldTrigger(5, 5);

            //then
            expect(instance instanceof PrrThresholdManager).toBeTruthy();
            expect(shouldTrigger).toBeTruthy();
        });

        it('Should get weapons threshold manager instance and return trigger status', async () => {
            //given
            const category = PrrCategory.WEAPONS;
            const state = Fixture.buildSettingsState(category);

            //when
            const instance = ThresholdManagerFactory.getManager(category, state);

            const shouldTrigger = instance.shouldTrigger(5, 5);

            //then
            expect(instance instanceof PrrThresholdManager).toBeTruthy();
            expect(shouldTrigger).toBeTruthy();
        });

        it('Should get proxy threshold manager instance and return trigger status', async () => {
            //given
            const category = PrrCategory.PROXY;
            const state = Fixture.buildSettingsState(category);

            //when
            const instance = ThresholdManagerFactory.getManager(category, state);

            const shouldTrigger = instance.shouldTrigger(5, 5);

            //then
            expect(instance instanceof PrrThresholdManager).toBeTruthy();
            expect(shouldTrigger).toBeTruthy();
        });
    });
});
