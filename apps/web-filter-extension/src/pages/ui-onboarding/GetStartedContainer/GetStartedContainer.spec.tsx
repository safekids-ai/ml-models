//GetStartedContainer

import GetStartedContainer from './index';
import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {EventType} from '@shared/types/message_types';
import {renderLogin} from './Login/loginTest';

const Component = <GetStartedContainer/>;

describe('GetStartedContainer screen => Safekids home onboarding', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test('Should render GetStartedContainer component successfully', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    render(Component);
    await act(async () => {
      await Promise.resolve();
    });
  });
  test('Should set Onboarding Feedback with Thank you page', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: (event: any, callback) => {
          if (event.type === EventType.GET_ONBOARDING_STATUS) {
            callback({status: 'COMPLETED'});
          }
        },
      },
    };
    render(Component);

    await act(async () => {
      await Promise.resolve();
    });
  });

  test('Should set Onboarding Feedback completed', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: (event: any, callback) => {
          if (event.type === EventType.GET_ONBOARDING_STATUS) {
            callback({status: 'IN_PROGRESS'});
          }
        },
      },
    };
    render(Component);

    const button = await screen.findByTestId('test-customize-btn');
    expect(button).toBeTruthy();
    fireEvent.click(button);

    await act(async () => {
      await Promise.resolve();
    });
  });
  test('Should set Onboarding Feedback completed', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: (event: any, callback) => {
          if (event.type === EventType.GET_ONBOARDING_STATUS) {
            callback({status: 'IN_PROGRESS'});
          }
        },
      },
    };
    render(Component);

    const button = await screen.findByTestId('test-recommended-settings-btn');
    expect(button).toBeTruthy();
    fireEvent.click(button);

    const laptopImage = screen.getByAltText('laptop-1');
    expect(laptopImage).toBeTruthy();

    await act(async () => {
      await Promise.resolve();
    });
  });
  test('Should show Get Started with no login', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockImplementation(async (): Promise<any> => {
      return {accessCode: undefined};
    });

    global.chrome = {
      // @ts-ignore
      management: {
        get: (id: string, callback) => {

        },
        // @ts-ignore
        onInstalled: {
          addListener(callback) {

          },
        },
        // @ts-ignore
        onDisabled: {
          addListener(callback) {

          },
        }
      },
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: (event: any, callback) => {
          if (event.type === 'LOGIN') {
            callback({accessCode: '111111'});
          } else if (event.type === 'GET_ONBOARDING_STATUS') {
            callback({status: 'IN_PROGRESS'});
          } else if (event.type === EventType.SAVE_ONBOARDING_STATUS) {
            callback({response: 'done'});
          }
        },
      },
    };
    await render(Component);
    await act(async () => {
      await Promise.resolve();
    });

    const button = screen.getByTestId('test-get-started-btn');
    expect(button).toBeTruthy();
    fireEvent.click(button);

    /*const field = screen.getByTestId("test-access-code-field");
    expect(field).toBeTruthy();*/


    const nextButton = await screen.findByText('NEXT');
    nextButton.removeAttribute('disabled');
    if (nextButton) {
      fireEvent.click(nextButton);
    }

    await act(async () => {
      await Promise.resolve();
    });
  });
});
