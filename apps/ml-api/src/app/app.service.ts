import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {NLPLabel, NLPNode, NLPResult} from "@safekids-ai/nlp-js-node";
import {VisionLabel, VisionNode} from "@safekids-ai/vision-js-node";
import {ConfigService} from "@nestjs/config";
import * as apiLogger from "abstract-logging";
import axios from "axios";
import {HostURLCategorizer, WebCategoryResult} from "@safekids-ai/web-categorize";
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class AppService implements OnModuleInit {
  nlpModel: NLPNode = null;
  visionModel: VisionNode = null;
  nlp_onnx_path: string;
  vision_onnx_path: string;
  webCategorizer: HostURLCategorizer;

  constructor(private readonly logger: Logger, private readonly configService: ConfigService) {
    this.nlp_onnx_path = configService.get("nlp_onnx_path");
    this.vision_onnx_path = configService.get("vision_onnx_path");

    apiLogger.debug = (args) => this.logger.debug(args);
    apiLogger.info = (args) => this.logger.log(args);
    apiLogger.error = (args) => this.logger.error(args);
    apiLogger.warn = (args) => this.logger.warn(args);
  }

  async classifyHate(message: string): Promise<NLPResult> {
    return await this.nlpModel.findHate(message);
  }

  async classifyText(message: string): Promise<NLPLabel> {
    return await this.nlpModel.classifyText(message);
  }

  async classifyImage(input: Buffer | ImageData): Promise<VisionLabel> {
    return await this.visionModel.classifyImage(input);
  }

  async classifyImageURL(url: string): Promise<VisionLabel> {
    this.logger.debug("Get image from url:" + url);
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

  async onModuleInit(): Promise<void> {
    //load the NLP model
    this.logger.log("Loading NLP Model");
    this.nlpModel = new NLPNode(this.nlp_onnx_path, apiLogger);
    await this.nlpModel.init();
    this.logger.log(`Successfully loaded NLP Model ${this.nlp_onnx_path}`);

    //load the Vision model
    this.logger.log("Loading Vision Model");
    this.visionModel = new VisionNode(this.vision_onnx_path, apiLogger);
    await this.visionModel.init();
    this.logger.log(`Successfully loaded Vision Model ${this.vision_onnx_path}`);

    //download and load categorization files.. do this async
    const downloadPath = os.tmpdir()
    this.webCategorizer = new HostURLCategorizer(downloadPath, apiLogger)
    this.logger.log("Download URL categorization data")
    this.webCategorizer.download().then(() => this.webCategorizer.load());
  }
}
