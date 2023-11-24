import {VisionLabel} from "@safekids-ai/vision-js-types";
import {Vision} from "@safekids-ai/vision-js-common";
import {InferenceSession} from "onnxruntime-common";
import {Logger} from "winston";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ort = require('onnxruntime-node');


class VisionNode extends Vision {
  constructor(modelUrl: string, logger?: Logger) {
    super(modelUrl, logger);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return ort.InferenceSession.create(modelUrl,
      {graphOptimizationLevel: 'all'});
  }
}

export {VisionNode, type VisionLabel}
