import {VisionLabel} from "@safekids-ai/vision-js-types";
import {Vision} from "@safekids-ai/vision-js-common";
import {InferenceSession} from "onnxruntime-common";
import * as Logger from 'abstract-logging';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ort = require('onnxruntime-node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageDataUtils = require('@andreekeberg/imagedata')

class VisionNode extends Vision {
  constructor(modelUrl: string, logger?: Logger) {
    super(modelUrl, logger);
  }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    return ort.InferenceSession.create(modelUrl,
      {graphOptimizationLevel: 'all'});
  }

  public async classifyImageBuffer(imageInput: Buffer): Promise<VisionLabel> {
    const imageData: ImageData = await imageDataUtils.getSync(imageInput);
    return super.classifyImage(imageData)
  }
}

export {VisionNode, type VisionLabel}
