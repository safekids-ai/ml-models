//GetStartedContainer

import React from 'react';
import {act, cleanup, render} from '@testing-library/react';
import GetStartedContainer from '../../../../../src/content/ui/onboarding/GetStartedContainer';
import {ChromeCommonUtils} from '../../../../../src/commons/chrome/utils/ChromeCommonUtils';

const Component = <GetStartedContainer/>;

describe('Onboarding screen => Safekids home onboarding', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  test('Main component is being rendered successfully', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    render(Component);
    await act(async () => {
      await Promise.resolve();
    });
  });
});
