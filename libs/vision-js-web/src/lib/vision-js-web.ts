import {VisionLabel} from "@safekids-ai/vision-js-types";
import {Vision} from '@safekids-ai/vision-js-common';
import {InferenceSession} from "onnxruntime-web";

class VisionWeb extends Vision {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return InferenceSession.create(modelUrl, {
      executionProviders: ['webgl', 'wasm'],
      graphOptimizationLevel: 'all'
    });
  }
}

export {VisionWeb, VisionLabel}
