import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { PrrLevel } from '../../../../shared//types/PrrLevel';
import PrrLevel2 from '../../../../pages/ui-prr/Main/PrrLevel2/PrrLevel2';

const defaultLanguage = { name: 'English', id: 'en', direction: 'ltr' };
const Component = <PrrLevel2 level={PrrLevel.ONE} language={defaultLanguage} category="EXPLICIT" siteName="www.google.com" prr2LimitExceeded={false} />;

describe('Trigger - PrrLevel2 Screen', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Should render PrrLevel2 Screen component successfully', () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    const response = ['Teacher1', 'Teacher2'];
                    callback(response);
                }),
            },
        };
        render(Component);
        const div = screen.getByText('It looks like you might be distracted.');
        expect(div).toBeTruthy();
    });

    test('Should render PrrLevel2 Screen component successfully but fail api', () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    throw new Error('Error');
                }),
            },
        };
        render(Component);
    });

    test('Should render PrrLevel2 Screen component successfully with no teacher', () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    callback(undefined);
                }),
            },
        };
        render(Component);
    });

    test("Should click I'M GOOD, THANKS. button.", () => {
        render(Component);
        const button = document.getElementById('i-am-good');
        expect(button).toBeTruthy();

        button?.click();
    });
});
