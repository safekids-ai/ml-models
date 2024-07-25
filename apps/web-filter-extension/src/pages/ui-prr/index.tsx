import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Main } from '@src/pages/ui-prr/Main';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/ui-prr');

ReactDOM.render(
    <React.StrictMode>
        <React.Suspense fallback="Loading...">
            <div>
                <Main />
            </div>
        </React.Suspense>
    </React.StrictMode>,
    document.getElementById('prr'),
);
