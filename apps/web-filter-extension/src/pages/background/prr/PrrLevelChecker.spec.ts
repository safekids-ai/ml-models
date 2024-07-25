import { PrrLevelChecker, PrrLevelCheckerImpl } from '../../../../src/pages/background/prr/PrrLevelChecker';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { PrrLevel } from '../../../../src/shared/types/PrrLevel';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { jest } from '@jest/globals';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ReduxStorage } from '../../../../src/shared/types/ReduxedStorage.type';
import { mock } from 'ts-mockito';

describe('Prr level checker tests', () => {
    let prrLevelChecker: PrrLevelChecker;
    const logger = new ConsoleLogger();
    const localStorageManager = mock(LocalStorageManager);
    const state = TestUtils.buildStore();
    beforeEach(async () => {
        prrLevelChecker = new PrrLevelCheckerImpl(state, logger, localStorageManager);
    });
    it('Should not check further if prr level is three', async () => {
        //given
        const report = {
            level: PrrLevel.THREE,
        };

        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue('some-value' as never);

        //when
        const result = await prrLevelChecker.check(report);

        //then
        expect(localStorageManagerGetSpy).toBeCalledTimes(0);
        expect(result).toMatchObject(report);
    });

    it('Should check further if prr level is 1', async () => {
        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValueOnce('some-value' as never);
        const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
        //given
        const report = {
            level: PrrLevel.ONE,
        };

        //when
        const result = await prrLevelChecker.check(report);

        //then
        expect(report).toMatchObject(result);
        expect(localStorageManagerSetSpy).toBeCalledTimes(5);
        expect(localStorageManagerGetSpy).toBeCalledTimes(4);
    });

    it('Should return prr level 2', async () => {
        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockImplementation(async (key: string) => {
            let value = 0;
            if (key === 'prr1Counter') {
                value = 4;
            }
            return value;
        });
        const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
        //given
        const report = {
            level: PrrLevel.TWO,
            isAiGenerated: true,
        };

        //when
        const result = await prrLevelChecker.check(report);

        //then
        expect(result).toMatchObject({ level: PrrLevel.TWO });
        expect(localStorageManagerGetSpy).toBeCalledTimes(4);
        expect(localStorageManagerSetSpy).toBeCalledTimes(1);
    });

    it('Should return prr level 2 when prr level 2 limit exceeds', async () => {
        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockImplementation(async (key: string) => {
            let value: any = 0;
            if (key === 'prr1Counter') {
                value = 1;
            } else if (key === 'prr2Counter') {
                value = 1;
            } else if (key === 'firstPRR2TimeLimit') {
                value = new Date();
                value.setTime(value.getTime() + 60 * 60);
            }
            return value;
        });
        const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
        //given
        const report = {
            level: PrrLevel.ONE,
            isAiGenerated: true,
        };

        //when
        const result = await prrLevelChecker.check(report);

        //then
        expect(result).toMatchObject({ level: '2', accessLimited: true });
        expect(localStorageManagerSetSpy).toBeCalledTimes(3);
        expect(localStorageManagerGetSpy).toBeCalledTimes(4);
    });

    it('Should use defautl threshold ', async () => {
        const newState = {
            getState: jest.fn().mockReturnValue({
                settings: {},
            }),
            dispatch: jest.fn(),
        } as ReduxStorage;

        prrLevelChecker = new PrrLevelCheckerImpl(newState, logger, localStorageManager);
        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValueOnce('some-value' as never);

        //given
        const report = {
            level: PrrLevel.ONE,
        };

        //when
        const result = await prrLevelChecker.check(report);

        //then
        expect(report).toMatchObject(result);
        expect(localStorageManagerGetSpy).toBeCalledTimes(4);
    });

    it('Should return prr level 1 and set 3 min(default) prr level limit', async () => {
        //mock dependencies
        const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockImplementation(async (key: string) => {
            let value: any = 0;
            if (key === 'prr1Counter') {
                value = 1;
            } else if (key === 'lastPRRTriggerTime') {
                value = new Date();
                value.setTime(value.getTime() - 60 * 60);
            }
            return value;
        });
        const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
        //given
        const report = {
            level: PrrLevel.ONE,
        };

        //when
        const result = await prrLevelChecker.check(report);
        //then
        expect(result).toMatchObject(report);
        expect(localStorageManagerSetSpy).toBeCalledTimes(3);
        expect(localStorageManagerGetSpy).toBeCalledTimes(4);
    });
});
