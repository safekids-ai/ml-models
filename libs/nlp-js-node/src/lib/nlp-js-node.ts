import {NLP,NLPLabel,NLPResult} from '@safekids-ai/nlp-js-common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ort = require('onnxruntime-node');
import {InferenceSession} from "onnxruntime-common";
class NLPNode extends NLP {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return ort.InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
  }
}

export {NLPNode, NLPLabel,NLPResult}
