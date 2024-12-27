import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import Inform from './index';
import {PrrLevel} from '@shared/types/PrrLevel';

const Component = <Inform level={PrrLevel.ONE} onTellMeMoreEvent={() => jest.fn()}/>;

describe('Trigger - Inform Screen => Safekids home onboarding', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  test('Inform Screen component is being rendered successfully', () => {
    render(Component);
  });

  test('Inform Screen component is rendering continue button correctly', async () => {
    render(Component);
    const button = screen.getByText('Keep Going');
    fireEvent.click(button);
    expect(button).toBeTruthy();
  });
});
