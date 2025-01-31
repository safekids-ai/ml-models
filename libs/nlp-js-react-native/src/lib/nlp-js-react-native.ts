import {NLPBert} from '@safekids-ai/nlp-js-common';
import { InferenceSession } from "onnxruntime-react-native";
class NLPWeb extends NLPBert {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
  }
}

export { NLPWeb}
