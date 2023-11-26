import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {NLPLabel, NLPNode, NLPResult} from "@safekids-ai/nlp-js-node";
import {VisionLabel, VisionNode} from "@safekids-ai/vision-js-node";

@Injectable()
export class AppService implements OnModuleInit {
  nlpModel: NLPNode = null;
  visionModel: VisionNode = null;

  constructor(private readonly logger: Logger) {
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
    this.nlpModel = new NLPNode("model_files/nlp.onnx");
    await this.nlpModel.init();
    this.logger.log("Successfully loaded NLP Model");

    //load the Vision model
    this.logger.log("Loading Vision Model");
    this.visionModel = new VisionNode("model_files/vision.onnx");
    await this.visionModel.init();
    this.logger.log("Successfully loaded Vision Model");
  }
}
