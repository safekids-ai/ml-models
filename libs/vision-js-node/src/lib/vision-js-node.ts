import {Vision,VisionLabel} from "@safekids-ai/vision-js-common";
import {InferenceSession} from "onnxruntime-common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ort = require('onnxruntime-node');


class VisionNode extends Vision {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return ort.InferenceSession.create(modelUrl,
      {graphOptimizationLevel: 'all'});
  }
}

export {VisionNode,VisionLabel}
