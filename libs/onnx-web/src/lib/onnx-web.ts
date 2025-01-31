import {InferenceSession, Tensor} from 'onnxruntime-common';
import * as ort from 'onnxruntime-web';
import * as Logger from 'abstract-logging';
import {OnnxRuntimeSessionProvider} from "@safekids-ai/onnx-common";

class OnnxRuntimeWeb implements OnnxRuntimeSessionProvider {
  public async createSession(modelUrl: string): Promise<InferenceSession> {
    try {
      return ort.InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
    } catch (err) {
      console.log("Unable to createSession:", err);
      throw new Error('failed to createSession due to' + JSON.stringify(err));
    }
  }
}

export default new OnnxRuntimeWeb();
