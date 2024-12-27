import {NLPModelWrapperInterface} from "./NLPModelWrapperInterface";
import {NLPModelInterface} from "./NLPModelInterface";
import {ILogger} from "@shared/utils/Logger";
import {toxicPhrases} from "@safekids-ai/nlp-js-common";
import sentence_tokenizer from "sbd";
import {NLPModelImpl} from "./NLPModelImpl";

export class NLPModelWrapper implements NLPModelWrapperInterface {
  private static instance: NLPModelWrapper;
  private nlpModel: NLPModelInterface;
  private toxicWords: Array<string>;
  private logger: ILogger;

  constructor(logger: ILogger, nlpModel?: NLPModelInterface, toxicWords?: Array<string>) {
    this.logger = logger;
    if (nlpModel) {
      this.nlpModel = nlpModel;
    }
    if (toxicWords) {
      this.toxicWords = toxicWords;
    }
  }

  async load() {
    if (!this.toxicWords) {
      this.toxicWords = toxicPhrases;
    }
    if (!this.nlpModel) {
      const modelImpl = new NLPModelImpl();
      this.nlpModel = modelImpl;
      this.logger.log("===== Loading the model");
      await modelImpl.load();
      this.logger.log("===== Loading Done");
    }
  }

  version(): string {
    return this.nlpModel.version();
  }

  async loadToxicWords(toxicWordUrl: string) {
    const response = await fetch(toxicWordUrl);
    const responseText = await response.text();

    this.splitAndStoreToxicWords(responseText);
  }

  splitAndStoreToxicWords(toxicWords: string) {
    this.toxicWords = new Array<string>();
    toxicWords.split(/\r|\n/).map(item => this.toxicWords.push(item));
    this.logger.log("Loaded " + this.toxicWords.length + " toxic words");
  }

  getURL(url: string) {
    return chrome.runtime.getURL(url);
  }

  getSentence(text: string, length: number): string {
    if (text.length <= length) {
      return text;
    }

    //we are going to keep this simple and go until the last space
    const lastSpace = text.lastIndexOf(" ", length);
    if (lastSpace >= 0) {
      return text.substring(0, lastSpace);
    }
    return text.substring(0, length);
  }

  static getSentencesIncludeToxicWords(text: string, _toxicWords: Array<string>): Array<string> {
    const toxicSentences = new Array<string>();

    //check the toxic word match for the rest
    const length = text.length;

    for (let i = 0; i < _toxicWords.length; i++) {
      const toxicWord = _toxicWords[i];
      const index = text.indexOf(" " + toxicWord);
      if (index > 0) {
        let startIndex = text.lastIndexOf(".", index);
        let endIndex = text.indexOf(".", index);

        startIndex = (startIndex < 0) ? Math.max(0, index - 100) : startIndex;
        endIndex = (endIndex < 0) ? Math.min(length, index + 100) : endIndex;
        if (startIndex > 0) {
          startIndex = startIndex + 1;
        }
        const stringToAnalyze = text.substring(startIndex, endIndex).trim();
        toxicSentences.push(stringToAnalyze);
      }
    }

    return toxicSentences;
  }

  async isToxic(text: string, lengthToAnalyze?: number, runToxicWordCheck?: boolean): Promise<boolean> {
    const startTime = new Date().getTime();
    if (!lengthToAnalyze) {
      lengthToAnalyze = text.length;
    }
    const analyzedFullString = lengthToAnalyze == text.length;
    const initialText = (analyzedFullString) ? text : this.getSentence(text, lengthToAnalyze);

    const sentences = sentence_tokenizer.sentences(initialText);

    for (let i = 0; i < sentences.length; i++) {
      const isHate = await this.nlpModel.isHate(sentences[i])
      if (isHate) {
        const endTime = new Date().getTime();
        this.logger.debug("[hate] Time Delta:" + (endTime - startTime) + " " + sentences[i]);
        return true;
      } else {
        const endTime = new Date().getTime();
        this.logger.debug("[clean] Time Delta:" + (endTime - startTime) + " " + sentences[i]);
      }
    }

    if (analyzedFullString || !runToxicWordCheck) {
      const endTime = new Date().getTime();
      this.logger.debug("Full String Analyzed via model. Time Delta:" + (endTime - startTime));
      return false;
    }

    //check the toxic word match for the rest
    const toxicSentences = NLPModelWrapper.getSentencesIncludeToxicWords(text, this.toxicWords);

    for (let i = 0; i < toxicSentences.length; i++) {
      const toxicSentence = toxicSentences[i];
      const isToxic = await this.nlpModel.isHate(toxicSentence);

      if (isToxic) {
        const endTime = new Date().getTime();
        this.logger.debug("[toxic] Time Delta:" + (endTime - startTime) + " " + toxicSentence);
        return true;
      }
    }
    const endTime = new Date().getTime();
    this.logger.debug("Smart Check Analysis Time Delta:" + (endTime - startTime));
    return false;
  }
}
