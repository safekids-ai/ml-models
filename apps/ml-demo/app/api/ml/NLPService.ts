//import {NLPNode} from "@safekids-ai/nlp-js-node";
import * as path from "path";

class NLPService {
  //private nlp: NLPNode;

  constructor() {
      //this.nlp = new NLPNode("../model_files/nlp.onnx");
  }

  async init() {
    //console.log("*****************" + path.join(), "../model_files/nlp.onnx");
    //await this.nlp.init();
  }
}

const nlpServiceImpl = new NLPService();
export {NLPService, nlpServiceImpl}
