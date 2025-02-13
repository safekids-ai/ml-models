import * as Logger from 'abstract-logging';
import * as ort from "onnxruntime-common";
import {InferenceSession, Tensor} from "onnxruntime-common"
import {loadONNXRuntime} from "@safekids-ai/onnx-model";
import {OnnxRuntimeSessionProvider} from "@safekids-ai/onnx-common";

import {
  env,
  AutoTokenizer, PreTrainedTokenizer,
} from "@huggingface/transformers";
import path from "path";

type LabelMap = { [key: number]: string };

interface PredictionResult {
  label: string;
  labelId: number;
  probability: number;
}

const categoryLabels: LabelMap = {
  0: "clothing_fashion_beauty",
  1: "self_body_image",
  2: "combat_sports",
  3: "other",
  4: "social_media_chat",
  5: "death_tragedy",
  6: "accidents_disasters",
  7: "phishing_fraud",
  8: "non_educational_games",
  9: "self_harm",
  10: "educational_games",
  11: "shopping_product_reviews",
  12: "gambling",
  13: "drugs_alcohol",
  14: "proxy_vpn",
  15: "violence",
  16: "wars_conflict",
  17: "explicit",
  18: "sex_education",
  19: "weapons",
  20: "entertainment_streaming_video"
};

class AiWebCategory {
  public static readonly version: string = "0.0.1";
  private readonly modelPath: string;
  private readonly onnxFileName: string;
  private readonly logger?: Logger;
  private readonly labelMap: LabelMap;
  private tokenizer: PreTrainedTokenizer;
  private session: InferenceSession;
  private indexToLabel: Record<number, string>;

  public constructor(modelPath: string, onnxFileName: string, labelMap?: LabelMap, logger?: Logger) {
    this.modelPath = modelPath;
    this.onnxFileName = onnxFileName;
    this.logger = logger;
    if (!labelMap) {
      this.labelMap = categoryLabels;
    } else {
      this.labelMap = labelMap;
    }
    this.indexToLabel = {...this.labelMap};
  }

  async initialize(): Promise<void> {
    const onnxFilePath = `${this.modelPath}/${this.onnxFileName}`;

    if (this.logger) {
      this.logger.info(`Loading model ${onnxFilePath}`);
    }
    const sessionProvider: OnnxRuntimeSessionProvider = await loadONNXRuntime()
    this.session = await sessionProvider.createSession(onnxFilePath);

    env.localModelPath = this.modelPath;
    this.tokenizer = await AutoTokenizer.from_pretrained(
      ".", {local_files_only: true});
  }

  async classify(text: string, threshold = 0.5, max_input_length = 256): Promise<PredictionResult[]> {
    if (!this.tokenizer || !this.session) {
      throw new Error("Model and tokenizer must be initialized. Call `await initialize()` first.");
    }

    const input_ids = this.tokenizer.encode(text, {
      add_special_tokens: true,
    });

    const padded_input_ids = input_ids.concat(
      new Array(Math.max(0, max_input_length - input_ids.length)).fill(0)
    );

    const attention_mask = input_ids.map(() => 1).concat(
      new Array(Math.max(0, max_input_length - input_ids.length)).fill(0)
    );

    const onnxInput = {
      input_ids: new Tensor("int64", this.toBigInt64Array(padded_input_ids), [1, padded_input_ids.length]),
      attention_mask: new Tensor("int64", this.toBigInt64Array(attention_mask), [1, attention_mask.length])
    };

    const results = await this.session.run(onnxInput, ["logits"]);

    const outputKey = Object.keys(results)[0]; // First output key
    const logitsTensor = results[outputKey] as ort.Tensor;
    const logits = logitsTensor.data as Float32Array; // Ensure Float32Array

    // Convert logits to a regular array before applying map()
    const logitsArray = Array.from(logits);
    const maxLogit = Math.max(...logitsArray);

    // Compute softmax
    const expLogitsArray = logitsArray.map((x) => Math.exp(x - maxLogit)); // Prevent overflow
    const sumExpLogits = expLogitsArray.reduce((a, b) => a + b, 0);
    const probabilitiesArray = expLogitsArray.map((x) => x / sumExpLogits);

    const probabilities: number[] = Array.from(probabilitiesArray);

    return probabilities
      .map((prob, index) => ({index, probability: prob})) // Keep index for label lookup
      .filter((item) => item.probability >= threshold) // Filter out low-probability classes
      .map((item) => ({
        label: this.indexToLabel[item.index] || `Class ${item.index}`, // Map index to label
        labelId: item.index,
        probability: item.probability
      }));
  }

  toBigInt64Array(numbers: number[]): BigInt64Array {
    return new BigInt64Array(numbers.map(num => BigInt(num)));
  }
}

export {AiWebCategory, LabelMap, PredictionResult};
