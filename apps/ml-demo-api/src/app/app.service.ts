import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {NLPLabel, NLPNode, NLPResult} from "@safekids-ai/nlp-js-node";

@Injectable()
export class AppService implements OnModuleInit {
  nlpModel: NLPNode = null;


  constructor(private readonly logger: Logger) {
  }

  async findHate(message: string): Promise<NLPResult> {
    return await this.nlpModel.findHate(message);
  }

  async classifyText(message: string): Promise<NLPLabel> {
    return await this.nlpModel.classifyText(message);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log("Loading NLP Model");
    this.nlpModel = new NLPNode("model_files/nlp.onnx");
    await this.nlpModel.init();
    this.logger.log("Successfully loaded NLP Model");
  }
}
