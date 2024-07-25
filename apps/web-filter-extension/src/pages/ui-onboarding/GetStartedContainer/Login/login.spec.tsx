import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import Login from '../../../../pages/ui-onboarding/GetStartedContainer/Login';
import { EventType } from '../../../../shared/types/message_types';

const Component = <Login loginComplete={onBoardingFeedbackComplete} onboardingFeedbackComplete={onBoardingFeedbackComplete} />;

let container: any = null;

export const renderLogin = async () => {
    act(() => {
        render(Component, container);
        callback();
    });
    await triggerLogin();
    act(() => {
        render(Component, container);
        callback();
    });
};

describe('Login Code screen => Safekids home onboarding', () => {
    beforeEach(() => {
        cleanup();
        // set up a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        cleanup();
    });

    test('Login component is being rendered successfully', async () => {
        render(Component);
        await act(callback);
    });
    test('Login is rendering SafeKids family image correctly', () => {
        const { getByAltText } = render(Component);
        expect(getByAltText('getStarted alternate image')).toBeTruthy();
    });

    test('Should click login button when login done', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: (event: any, callback) => {
                    if (event.type === 'LOGIN') {
                        callback({ accessCode: '111111' });
                    } else if (event.type === 'GET_ONBOARDING_STATUS') {
                        callback({ status: 'IN_PROGRESS' });
                    } else if (event.type === EventType.SAVE_ONBOARDING_STATUS) {
                        callback({ response: 'done' });
                    }
                },
            },
        };

        //await renderLogin();
    });

    test('Should click login button when login failed', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: (event: any, callback) => {
                    if (event.type === 'LOGIN') {
                        callback(undefined);
                    } else if (event.type === 'GET_ONBOARDING_STATUS') {
                        callback({ status: 'IN_PROGRESS' });
                    } else if (event.type === EventType.SAVE_ONBOARDING_STATUS) {
                        callback({ response: 'done' });
                    }
                },
            },
        };
        //await renderLogin();
    });

    test('Should click login button and Onboarded completed', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: (event: any, callback) => {
                    if (event.type === 'LOGIN') {
                        callback({ accessCode: '111111' });
                    } else if (event.type === 'GET_ONBOARDING_STATUS') {
                        callback({ status: 'COMPLETED' });
                    } else if (event.type === EventType.SAVE_ONBOARDING_STATUS) {
                        callback({ response: 'done' });
                    }
                },
            },
        };

        //await renderLogin();
    });
});

async function callback() {
    Promise.resolve();
}
async function onBoardingFeedbackComplete() {
    Promise.resolve();
}

export const triggerLogin = async () => {
    let accessCodeInputs = document.getElementsByClassName('pin-input-field');
    for (let i = 0; i < accessCodeInputs.length; i++) {
        const inputElement = accessCodeInputs[i] as HTMLInputElement;
        inputElement.value = '1';
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', false, true);
        inputElement.dispatchEvent(evt);
    }

    for (let i = 0; i < accessCodeInputs.length; i++) {
        const inputElement = accessCodeInputs[i] as HTMLInputElement;
        console.log(`inputElement##1# ${inputElement.value}`);
    }

    const button = await screen.findByText('NEXT');
    if (button) {
        fireEvent.click(button);
    }
};
