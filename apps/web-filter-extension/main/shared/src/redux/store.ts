import { createStore } from 'redux';

import { rootReducer } from '@shared/redux/reducers';

export type PRRThreshold = {
    category: string;
    mlMin: number;
    nlpMin: number;
    mlMax?: number;
    nlpMax?: number;
};
export const store = createStore(rootReducer);
