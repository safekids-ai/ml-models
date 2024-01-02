import * as React from "react";
import * as ReactDOM from "react-dom";
import GetStarted from "./app/onboarding/getStarted";

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <GetStarted />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("onboarding")
);
