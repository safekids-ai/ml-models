import React from 'react';
import { render, getByAltText, screen, cleanup } from '@testing-library/react';
import SelectChoices from '../../../../../pages/ui-onboarding/GetStartedContainer/NewFeedback/selectChoicesNew';

const Component = <SelectChoices currentSelectedOption="ALLOW" setOption={() => jest.fn()} />;

describe('SelectChoices Component => Safekids home onboarding', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('SelectChoicesNew Component is being rendered successfully', () => {
        render(Component);
    });
});
