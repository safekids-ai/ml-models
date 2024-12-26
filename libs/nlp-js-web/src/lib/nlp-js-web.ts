import {NLP} from '@safekids-ai/nlp-js-common';
import {env,InferenceSession} from "onnxruntime-web";
//import {Env} from "onnxruntime-common";
//import WasmPrefixOrFilePaths = Env.WasmPrefixOrFilePaths;
class NLPWeb extends NLP {
  constructor(modelUrl: string) {
    super(modelUrl);
  }

  // constructor(modelUrl: string, wasmPaths?: WasmPrefixOrFilePaths) {
  //   super(modelUrl);
  //   if (wasmPaths) {
  //     console.log("Loading WASM files from " + wasmPaths);
  //     //env.wasm.wasmPaths = wasmPaths;
  //   }
  // }

  public createSession(modelUrl: string): Promise<InferenceSession> {
    try {
      return InferenceSession.create(modelUrl, {graphOptimizationLevel: 'all'});
    } catch (err) {
      console.log("Unable to createSession for NLP:", err);
      throw new Error('failed to createSession due to' + JSON.stringify(err));
    }
  }
}

export {NLPWeb}
