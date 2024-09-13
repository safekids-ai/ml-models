import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Main} from '@pages/ui-prr/Main';

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <div>
        <Main/>
      </div>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('prr'),
);
