import {NLPLabel,NLPResult} from "@safekids-ai/nlp-js-types";
import {NLP} from '@safekids-ai/nlp-js-common';
import {InferenceSession} from "onnxruntime-web";
class NLPWeb extends NLP {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
  }
}

export { NLPWeb,NLPLabel,NLPResult}
