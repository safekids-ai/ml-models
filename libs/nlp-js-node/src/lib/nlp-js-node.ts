import {NLPLabel,NLPResult} from "@safekids-ai/nlp-js-types";
import {NLP} from '@safekids-ai/nlp-js-common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ort = require('onnxruntime-node');
import {InferenceSession} from "onnxruntime-common";
import * as Logger from 'abstract-logging';

class NLPNode extends NLP {
  constructor(modelUrl: string, logger?: Logger) {
    super(modelUrl, logger);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return ort.InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
  }
}

export {NLPNode, NLPLabel, type NLPResult}
