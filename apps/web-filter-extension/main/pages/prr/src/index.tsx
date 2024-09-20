import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import {Main} from '@src/Main';

const root = ReactDOM.createRoot(document.getElementById("prr"));
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <div>
        <Main/>
      </div>
    </React.Suspense>
  </React.StrictMode>,
);
