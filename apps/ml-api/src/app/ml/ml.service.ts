import {Injectable, OnModuleInit} from '@nestjs/common';
import {NLPLabel,NLPResult} from "@safekids-ai/nlp-js-types";
import {NLPNode} from "@safekids-ai/nlp-js-node";
import {VisionLabel, VisionNode} from "@safekids-ai/vision-js-node";
import {ConfigService} from "@nestjs/config";
import apiLogger from "abstract-logging";
import axios from "axios";
import {HostURLCategorizer, WebCategoryResult, UriUtils} from "@safekids-ai/web-categorize";
import * as path from 'path';
import * as os from 'os';
import {ModelConfig} from "../config/model";
import {LoggingService} from "../logger/logging.service";

@Injectable()
export class MlService implements OnModuleInit {
  nlpModel: NLPNode = null;
  visionModel: VisionNode = null;
  nlp_onnx_path: string;
  vision_onnx_path: string;
  webCategorizer: HostURLCategorizer;

  constructor(private readonly log: LoggingService, private readonly configService: ConfigService) {
    if (!log) {
      throw new Error(("Logging service is not wired"))
    }
    this.log.className(MlService.name);

    const modelConfig = configService.get<ModelConfig>("modelConfig")
    this.log.debug("Model Configuration", modelConfig)
    this.nlp_onnx_path = modelConfig.nlp_onnx_path
    this.vision_onnx_path = modelConfig.vision_onnx_path

    const finalLogger = log;
    apiLogger.debug = (args) => finalLogger.debug(args);
    apiLogger.info = (args) => finalLogger.info(args);
    apiLogger.error = (args) => finalLogger.error(args);
    apiLogger.warn = (args) => finalLogger.warn(args);
  }

  async classifyHate(message: string): Promise<NLPResult> {
    return await this.nlpModel.findHate(message, apiLogger);
  }

  async classifyText(message: string): Promise<NLPLabel> {
    return await this.nlpModel.classifyText(message, apiLogger);
  }

  async classifyImage(input: Buffer | ImageData): Promise<VisionLabel> {
    return await this.visionModel.classifyImage(input);
  }

  async classifyImageURL(url: string): Promise<VisionLabel> {
    this.log.debug("Get image from url:" + url);
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer', // Treat the response as an ArrayBuffer
    });
    const imageBuffer = Buffer.from(response.data);
    return await this.classifyImage(imageBuffer);
  }

  classifyWebsite(url: string): WebCategoryResult[] {
    return this.webCategorizer.getCategory(url)
  }

  validateURI(uri: string): boolean {
    return UriUtils.isValidUri(uri)
  }

  async onModuleInit(): Promise<void> {
    //load the NLP model
    // apiLogger.info("Loading NLP Model");
    // this.nlpModel = new NLPNode(this.nlp_onnx_path, apiLogger);
    // await this.nlpModel.init();
    // apiLogger.info(`Successfully loaded NLP Model ${this.nlp_onnx_path}`);
    //
    // //load the Vision model
    // apiLogger.info("Loading Vision Model");
    // this.visionModel = new VisionNode(this.vision_onnx_path, apiLogger);
    // await this.visionModel.init();
    // apiLogger.info(`Successfully loaded Vision Model ${this.vision_onnx_path}`);
    // console.log("Abbas2")
    //
    // //download and load categorization files.. do this async
    // const downloadPath = os.tmpdir()
    // this.webCategorizer = new HostURLCategorizer(downloadPath, apiLogger)
    // this.logger.info("Download URL categorization data")
    // this.webCategorizer.init()
  }
}
