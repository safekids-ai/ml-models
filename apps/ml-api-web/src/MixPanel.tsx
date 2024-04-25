import mixpanel, { Callback, Dict } from 'mixpanel-browser';
import { isProduction } from './constants';

const DEBUG = false;
const reportToMixPanel = DEBUG || isProduction;
if (reportToMixPanel)
    mixpanel.init(
        '1079fc411328d849e46756eb9e3eb3d5',
        // : "66f1e4e43c216c1e4256aa6666ad0b65"
    );

const actions = {
    identify: (id: string | undefined) => {
        if (reportToMixPanel) mixpanel.identify(id);
    },
    alias: (id: string) => {
        if (reportToMixPanel) mixpanel.alias(id);
    },
    track: (name: string, props: Dict | undefined) => {
        if (reportToMixPanel) mixpanel.track(name, props);
    },
    people: {
        set: (props: Dict, callback?: Callback) => {
            if (reportToMixPanel) mixpanel.people.set(props, callback);
        },
    },
};

export const MixPanel = actions;
