import React from 'react';
import * as ReactDOM from 'react-dom/client';
import GetStarted from "@src/onboarding/getStarted";

const root = ReactDOM.createRoot(document.getElementById("onboarding") as HTMLElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <GetStarted/>
    </React.Suspense>
  </React.StrictMode>
);
