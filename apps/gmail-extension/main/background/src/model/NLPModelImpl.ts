import {NLPModelInterface} from "./NLPModelInterface";
import {NLPBert} from "@safekids-ai/nlp-js-common";

export class NLPModelImpl implements NLPModelInterface {
  private readonly model: NLPBert;
  initDone: boolean = false;

  modelPath: string = "models/hate/nlp.onnx";

  constructor(_modelPath?: string) {
    if (_modelPath) {
      this.modelPath = _modelPath;
    }
    this.model = new NLPBert(this.modelPath);
  }

  load = async () => {
    await this.model.init();
    this.initDone = true;
  }

  isHate(text: string): Promise<boolean> {
    if (!this.initDone) {
      throw new Error("Please call model load before isHate is available");
    }
    return this.model.classifyAsHate(text);
  }

  version(): string {
    return this.model.version();
  }
}
