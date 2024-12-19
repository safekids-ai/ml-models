import {VisionLabel} from "@safekids-ai/vision-js-types";
import {InferenceSession, Tensor} from 'onnxruntime-common';
import {visionConfig} from './model'
import * as Logger from 'abstract-logging';
import cv from "@techstark/opencv-js";

//const cv = require("@techstark/opencv-js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const imageDataUtils = require('@andreekeberg/imagedata')
//import imageDataUtils from '@andreekeberg/imagedata';

abstract class Vision {
  public static readonly version: string = "0.0.1";
  private session: InferenceSession
  private readonly onnxUrl: string
  private readonly logger?: Logger;

  constructor(onnxUrl: string, logger?: Logger) {
    this.onnxUrl = onnxUrl;
    this.logger = logger;
  }

  public abstract createSession(onnxUrl: string): Promise<InferenceSession>

  public async handleCreateSession(onnxFile: string): Promise<InferenceSession> {
    if (this.logger) {
      this.logger.debug("initialized opencv");
    }
    if (this.logger) {
      this.logger.info(`Loading model ${this.onnxUrl}`);
    }
    return await this.createSession(onnxFile);
  }

  public async init(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    if (cv && cv.Mat) {
      this.session = await this.handleCreateSession(this.onnxUrl);
      return;
    }

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
        const sessionPromise: Promise<InferenceSession> = this.handleCreateSession(this.onnxUrl);
        sessionPromise.then(r => {
          me.session = r;
          resolve();
        }).catch(e => reject(e))
      };
      setTimeout(() => {
        reject(new Error("failed to initialize opencv or session within 2 seconds"));
      }, 2000); // fail after 5 seconds
    });
  }

  // public async classifyImage(buffer: Buffer): Promise<VisionLabel> {
  //   const mat = cv.imread(buffer);
  //   const imageData = new ImageData(new Uint8ClampedArray(mat.getData()), mat.cols, mat.rows);
  //   mat.delete();
  //   return this.classifyImageData(imageData);
  // }


  public async classifyImage(imageData: ImageData): Promise<VisionLabel> {
    if (!this.session) {
      throw new Error("Please call init() to initialize the InferenceSession");
    }

    let startTime = new Date().getTime();
    const onnxInput = await getImageTensor(imageData);
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

    if (this.logger) {
      const totalTime = preProcessingTime + inferenceTime;
      this.logger.debug(`vision: label: ${label} finalLabel: ${finalLabel} maxIndex: ${maxIndex} maxProb: ${maxProb} inferenceTime: ${inferenceTime} totalTime: ${totalTime}`);
    }
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

async function getImageTensor(imageData: ImageData): Promise<Tensor> {
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
