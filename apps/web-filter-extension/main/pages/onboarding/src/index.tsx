import React from 'react';
import * as ReactDOM from 'react-dom/client';

import 'antd/es/slider/style';
import GetStartedContainer from '@src/GetStartedContainer';
//import refreshOnUpdate from 'virtual:reload-on-update-in-view';
//refreshOnUpdate('pages/ui-onboarding');

/* istanbul ignore next */
const root = ReactDOM.createRoot(document.getElementById("onboarding") as HTMLElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <GetStartedContainer/>
    </React.Suspense>
  </React.StrictMode>
);
