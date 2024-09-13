import React from 'react';
import * as ReactDOM from 'react-dom';
import {render, screen, cleanup} from '@testing-library/react';
import {within} from '@testing-library/dom';
import GetStarted from './index';

describe('Get Started screen => Safekids home onboarding', () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  test('GetStarted components is being rendered successfully', () => {
    render(<GetStarted getStartedClicked={() => jest.fn()}/>);
  });
  test('Get Started component is rendering SafeKids Logo image correctly', () => {
    const {getByAltText} = render(<GetStarted getStartedClicked={() => jest.fn()}/>);
    expect(getByAltText('SafeKids Logo')).toBeTruthy();
  });
  test('Get Started component is rendering Onboarding family image correctly ', () => {
    const {getByAltText} = render(<GetStarted getStartedClicked={() => jest.fn()}/>);
    expect(getByAltText('Onboarding family image')).toBeTruthy();
  });
  test('GetStarted components is rendering signup link correctly', () => {
    const {container} = render(<GetStarted getStartedClicked={() => jest.fn()}/>);
    expect(container.querySelector('a')?.innerHTML?.toLocaleLowerCase()).toBe('go here');
  });
  test('Get Started component is rendering paragraph under family image correctly ', () => {
    render(<GetStarted getStartedClicked={() => jest.fn()}/>);
    expect(screen.getByTestId('test-all-set-li').textContent).toContain(`You're all set.`);
  });
});
