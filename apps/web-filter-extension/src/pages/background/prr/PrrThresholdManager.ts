import { ReduxStorage } from '../../../shared/types/ReduxedStorage.type';

export class ThresholdManagerFactory {
    private static readonly beans = new Map<string, PrrThresholdManager>();
    static getManager(category: string, store: ReduxStorage): PrrThresholdManager {
        switch (category.toUpperCase()) {
            case 'PORN':
            case 'ADULT_CONTENT':
                return new ExplicitThresholdManager(store, 'PORN');
            case 'WEAPONS':
                return new SelfHarmThresholdManager(store, category);
            case 'SELF_HARM':
            case 'SELF_HARM_SUICIDAL_CONTENT':
                return new SelfHarmThresholdManager(store, 'SELF_HARM');
            case 'PROXY':
                return new ProxyThresholdManager(store, category);
            default:
                return new PrrThresholdManager(store, category);
        }
    }
}

export type PrrThreshold = {
    category: string;
    mlMin: number;
    nlpMin: number;
    mlMax: number;
    nlpMax: number;
};

export type ThresholdManager = {
    shouldTrigger: (ml: number, nlp: number) => boolean;
};

export class PrrThresholdManager implements ThresholdManager {
    private readonly store: ReduxStorage;
    protected readonly threshold: PrrThreshold;
    constructor(store: ReduxStorage, category: string) {
        this.store = store;
        const { prrThresholds } = this.store.getState().settings;
        this.threshold = prrThresholds[category];
    }

    shouldTrigger(ml: number, nlp: number): boolean {
        const { mlMin, mlMax, nlpMax, nlpMin } = this.threshold;
        return (ml >= mlMin && nlp >= nlpMin) || ml >= mlMax || nlp >= nlpMax;
    }
}

class ExplicitThresholdManager extends PrrThresholdManager {
    constructor(store: ReduxStorage, category: string) {
        super(store, category);
    }

    override shouldTrigger(ml: number, nlp: number): boolean {
        const { mlMin, mlMax, nlpMax, nlpMin } = this.threshold;
        return (ml >= mlMin && nlp >= nlpMin) || ml >= mlMax || nlp >= nlpMax;
    }
}

// class WeaponsThresholdManager extends PrrThresholdManager {
//     constructor(store: ReduxStorage, category: string) {
//         super(store, category);
//     }

//     override shouldTrigger(ml: number, nlp: number): boolean {
//         const { mlMin, mlMax, nlpMax, nlpMin } = this.threshold;
//         return (ml >= mlMin && nlp >= nlpMin) || ml >= mlMax || nlp >= nlpMax;
//     }
// }

class SelfHarmThresholdManager extends PrrThresholdManager {
    constructor(store: ReduxStorage, category: string) {
        super(store, category);
    }

    override shouldTrigger(ml: number, nlp: number): boolean {
        const { mlMin, mlMax, nlpMax, nlpMin } = this.threshold;
        return (ml >= mlMin && nlp >= nlpMin) || ml >= mlMax || nlp >= nlpMax;
    }
}

class ProxyThresholdManager extends PrrThresholdManager {
    constructor(store: ReduxStorage, category: string) {
        super(store, category);
    }

    override shouldTrigger(ml: number, nlp: number): boolean {
        const { mlMin, nlpMax, nlpMin } = this.threshold;
        return (ml >= mlMin && nlp >= nlpMin) || nlp >= nlpMax;
    }
}
