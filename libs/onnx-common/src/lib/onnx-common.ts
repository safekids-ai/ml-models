import {InferenceSession, Tensor} from 'onnxruntime-common';
import * as Logger from 'abstract-logging';

interface OnnxRuntimeSessionProvider {
  createSession(modelUrl: string): Promise<InferenceSession>;
}

class OnnxRuntime {
  protected sessionProvider: OnnxRuntimeSessionProvider;
  protected session: InferenceSession;
  protected readonly onnxUrl: string;
  protected logger?: Logger;

  protected constructor(onnxUrl: string, sessionProvider: OnnxRuntimeSessionProvider, logger?: Logger) {
    this.onnxUrl = onnxUrl;
    this.logger = logger;
    this.sessionProvider = sessionProvider;
  }

  public get getSession(): InferenceSession {
    if (!this.session) {
      throw new Error("ONNX session is not initialized. Call `init()` first.");
    }
    return this.session;
  }

  public async init() {
    if (this.logger) {
      this.logger.info(`Loading model ${this.onnxUrl}`);
    }
    this.session = await this.sessionProvider.createSession(this.onnxUrl);
  }
}

export {OnnxRuntime, OnnxRuntimeSessionProvider}
