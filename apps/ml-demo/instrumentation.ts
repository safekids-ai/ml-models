import {nlpServiceImpl} from "./app/api/ml/NLPService";

export function register() {
  console.log("Initializing NLP Code ");
  nlpServiceImpl.init();
}
