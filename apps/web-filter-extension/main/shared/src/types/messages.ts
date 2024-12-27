/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

export class PredictionRequest {
    public reconnectTimer?: number;

    constructor(
        public readonly url: string,
        public readonly type?: string, // @DOCS Chrome internal usage
        public readonly requestType?: string,
        public readonly host?: string,
        public data?: string
    ) {}
}

export class PredictionResponse {
    public readonly message?: string;
    public prrStatus: boolean;
    public prThreshold?: number = 0;
    public prThresholdType?: string = '';
    public showClean?: boolean = false;

    constructor(public readonly prediction: any, public readonly url: string, error?: string, prrStatus: boolean = false) {
        this.message =
            typeof error === 'string' && error.length > 0
                ? `Prediction result is ${prediction} for image ${url}, error: ${error}`
                : `Prediction result is ${prediction} for image ${url}`;
        this.prrStatus = prrStatus;
    }
}
