import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import Ask from './index';
import {PrrLevel} from '@shared/types/PrrLevel';

const Component = <Ask level={PrrLevel.ONE} onTellMeMoreEvent={() => jest.fn()}/>;

describe('Trigger - Ask Screen => Safekids home onboarding', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  test('Ask Screen component is being rendered successfully', () => {
    render(Component);
  });

  test('Ask Screen component is rendering continue button correctly', async () => {
    render(Component);
    const button = screen.getByText('Ask An Adult');
    fireEvent.click(button);
    expect(button).toBeTruthy();
  });
});
