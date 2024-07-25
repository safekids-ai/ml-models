import React from 'react';
import * as ReactDOM from 'react-dom';

import 'antd/es/slider/style';
import GetStartedContainer from '@src/pages/ui-onboarding/GetStartedContainer';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/ui-onboarding');

/* istanbul ignore next */
ReactDOM.render(
    <React.StrictMode>
        <React.Suspense fallback="Loading...">
            <GetStartedContainer />
        </React.Suspense>
    </React.StrictMode>,
    document.getElementById('onboarding'),
);
