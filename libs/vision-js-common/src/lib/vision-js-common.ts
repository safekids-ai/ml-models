import {InferenceSession, Tensor} from 'onnxruntime-common';
import {visionConfig} from './model'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cv = require("@techstark/opencv-js");
import * as winston from 'winston';

enum VisionLabel {
  Porn = "porn",
  Clean = "clean",
  Weapons = "weapons"
}

abstract class Vision {
  public static readonly version: string = "0.0.1";
  private session: InferenceSession
  private readonly onnxUrl: string
  private readonly logger?: winston.Logger;

  constructor(onnxUrl: string, logger?: winston.Logger) {
    this.onnxUrl = onnxUrl;
    this.logger = logger;
  }

  public abstract createSession(onnxUrl: string): Promise<InferenceSession>

  public async init(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    return new Promise((resolve, reject) => {
      if (!cv) {
        throw new Error("OpenCV is not defined and unavailable");
      }
      cv.onRuntimeInitialized = () => {
        if (this.logger) {
          this.logger.debug("initialized opencv");
        }
        if (this.logger) {
          this.logger.info(`Loading model ${this.onnxUrl}`);
        }
        const sessionPromise: Promise<InferenceSession> = this.createSession(this.onnxUrl);
        sessionPromise.then(r => {
          me.session = r;
          resolve();
        }).catch(e => reject(e))
      };
      setTimeout(() => {
        reject(new Error("failed to initialize opencv or session within 2 seconds"));
      }, 2000); // fail after 2 seconds
    });
  }

  public async classifyImageData(imageData: ImageData): Promise<VisionLabel> {
    if (!this.session) {
      throw new Error("Please call init() to initialize the InferenceSession");
    }

    let startTime = new Date().getTime();
    const onnxInput = await getImageTensorFromImageData(imageData);
    const preProcessingTime = new Date().getTime() - startTime;
    startTime = new Date().getTime();
    const _output = await this.session.run({images: onnxInput});
    const output = _output["output0"]["data"]
    const probs = await this.softmax(Array.prototype.slice.call(output))
    const maxProb = Math.max.apply(null, probs);
    const maxIndex = probs.indexOf(maxProb);
    const label = visionConfig.labels[maxIndex];
    let finalLabel = label;

    if (maxProb < visionConfig.scores[maxIndex]) {
      finalLabel = "clean";
    }

    const inferenceTime = new Date().getTime() - startTime;

    console.debug("vision:", "label:", label, "finalLabel:", finalLabel, "maxIndex:", maxIndex, "maxProb:", maxProb, "inferenceTime:", inferenceTime, "totalTime:", preProcessingTime + inferenceTime)

    return finalLabel as VisionLabel

  }

  private async softmax(vector: number[]): Promise<number[]> {
    const sum = vector.reduce(function (acc, value) {
      return acc + Math.exp(value);
    }, 0);

    return vector.map(function (value) {
      return Math.exp(value) / sum;
    });
  }
}


async function getImageTensorFromImageData(imageData: ImageData): Promise<Tensor> {
  const matC3 = new cv.Mat(224, 224, cv.CV_8UC3);
  const mat = cv.matFromImageData(imageData);
  cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR
  mat.delete();

  const input = cv.blobFromImage(
    matC3,
    1 / 255.0,
    new cv.Size(224, 224),
    new cv.Scalar(0.485 * 255, 0.456 * 255, 0.406 * 255),
    true,
    false
  );

  // std = [0.229, 0.224, 0.225]
  // input_blob[0] /= np.asarray(std, dtype=np.float32).reshape(3, 1, 1)

  matC3.delete();

  return new Tensor("float32", input.data32F, [1, 3, 224, 224]);
}

export {Vision, type VisionLabel}
