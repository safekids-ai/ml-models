import React from 'react';
import {cleanup, render} from '@testing-library/react';
import Thanks from '../../../../ui-prr/Main/Triggers/Thanks';
import { PrrLevel } from '../../../../../shared/types/PrrLevel';

const Component = <Thanks level={PrrLevel.ONE} category="" siteName="" onTellMeMoreEvent={() => jest.fn()} />;

describe('Trigger - Thanks Screen => Safekids home onboarding', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Thanks Screen component is being rendered successfully', () => {
        render(Component);
    });
});
