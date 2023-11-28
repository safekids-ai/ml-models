import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {NLPLabel, NLPNode, NLPResult} from "@safekids-ai/nlp-js-node";
import {VisionLabel, VisionNode} from "@safekids-ai/vision-js-node";
import {ConfigService} from "@nestjs/config";
import {logger} from "nx/src/utils/logger";
import * as apiLogger from "abstract-logging";

@Injectable()
export class AppService implements OnModuleInit {
  nlpModel: NLPNode = null;
  visionModel: VisionNode = null;
  nlp_onnx_path: string;
  vision_onnx_path: string;


  constructor(private readonly logger: Logger, private readonly configService: ConfigService) {
    this.nlp_onnx_path = configService.get("nlp_onnx_path");
    this.vision_onnx_path = configService.get("vision_onnx_path");

    apiLogger.debug  = (args) => this.logger.debug(args);
    apiLogger.info  = (args) => this.logger.log(args);
    apiLogger.error  = (args) => this.logger.error(args);
    apiLogger.warn  = (args) => this.logger.warn(args);
  }

  async classifyHate(message: string): Promise<NLPResult> {
    return await this.nlpModel.findHate(message);
  }

  async classifyText(message: string): Promise<NLPLabel> {
    return await this.nlpModel.classifyText(message);
  }

  async classifyImage(input: Buffer | ImageData) : Promise<VisionLabel> {
    return await this.visionModel.classifyImage(input);
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
  }
}
