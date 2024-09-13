import React from 'react';
import LimitAccessScreen from './limitAccessScreen';
import {cleanup, fireEvent, render, screen, act, waitFor} from '@testing-library/react';
import {PrrLevel} from '@shared/types/PrrLevel';
import * as Common from '../common';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';

const defaultLanguage = {name: 'English', id: 'en', direction: 'ltr'};
const Component = <LimitAccessScreen level={PrrLevel.ONE} language={defaultLanguage} category="EXPLICIT"
                                     siteName="www.google.com"/>;

describe('Trigger - Limit Access Screen', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  test('Should render LimitAccessScreen Screen component successfully', async () => {
    jest.spyOn(ChromeCommonUtils, 'getAccessLimitedTime').mockResolvedValue('Wed Oct 26 2022 15:22:57');
    act(() => {
      render(Component);
    });
    let line1, line2;
    await waitFor(() => {
      line1 = screen.getByText(/Sorry, your access has been limited for around 5 minutes./i);
      line2 = screen.getByText(
        /Your parent hasn't set up any allowed sites so you'll just have to wait till 3:28 PM to start using the internet again./i
      );
    });
    expect(line1).toBeTruthy();
    expect(line2).toBeTruthy();
  });

  test('Should render LimitAccessScreen Screen component successfully with permissible sites', async () => {
    const permissibleSites = ['facebook.com', 'instagram.com'];
    jest.spyOn(ChromeCommonUtils, 'getPermissibleURLs').mockResolvedValue(permissibleSites);
    jest.spyOn(ChromeCommonUtils, 'getAccessLimitedTime').mockResolvedValue('Wed Oct 26 2022 15:22:57');
    act(() => {
      render(Component);
    });
    let line1, line2, website1, website2;
    await waitFor(() => {
      line1 = screen.getByText(/Sorry, but your access has been limited to the sites listed for around 5 minutes./i);
      line2 = screen.getByText(/Please wait till, 3:28 PM to access the internet again./i);
      website1 = screen.getByText(/facebook.com/i);
      website2 = screen.getByText(/instagram.com/i);
    });
    expect(line1).toBeTruthy();
    expect(line2).toBeTruthy();
    expect(website1).toBeTruthy();
    expect(website2).toBeTruthy();
  });

  test('Should click Take Me Back button.', () => {
    const spy = jest.spyOn(Common, 'closeTab').mockImplementation(() => {
    });
    render(Component);
    const button = screen.getByText('I UNDERSTAND');
    fireEvent.click(button);
    expect(spy).toBeCalled();
  });
});
