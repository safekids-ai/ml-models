import {Tokenizer} from './tokenizer';
import {modelConfig} from './model';
import {toxicPhrases} from './constants';
import {InferenceSession, Tensor} from 'onnxruntime-common';
import {sentences} from "sbd"
import * as Logger from 'abstract-logging';
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";

abstract class NLP {
  public static readonly version: string = "0.0.1";
  private readonly tokenizer: Tokenizer;
  private session: InferenceSession;
  private readonly onnxUrl: string;
  private logger?: Logger;

  protected constructor(onnxUrl: string, logger?: Logger) {
    this.onnxUrl = onnxUrl;
    this.logger = logger;
    this.tokenizer = new Tokenizer();
  }

  public version() : string {
    return NLP.version;
  }

  public abstract createSession(onnxUrl: string): Promise<InferenceSession>

  public async init() {
    if (this.logger) {
      this.logger.info(`Loading model ${this.onnxUrl}`);
    }
    this.session = await this.createSession(this.onnxUrl);
  }

  private async softmax(vector: number[]): Promise<number[]> {
    const sum = vector.reduce(function (acc, value) {
      return acc + Math.exp(value);
    }, 0);

    return vector.map(function (value) {
      return Math.exp(value) / sum;
    });
  }

  public preprocess(text: string): string {
    try {
      text = text.replace(".", " ").replace("-", " ").replace(/[\s\r\n]/gm, " ").toLowerCase();
      const allWords = text.split(' ');

      text = '';
      for (let i = 0; i < allWords.length; i++) {
        if (!allWords[i].startsWith('http') && !allWords[i].startsWith('www') && isNaN(parseInt(allWords[i]))) {
          text = text + " " + allWords[i]
        }
      }

      const punctuation = `!"#$%&'()+,-./:;<=>?@[\\]^_{|}~–|»›` + "`";
      for (let c_i = 0; c_i < punctuation.length; c_i++) {
        text = text.replace(punctuation[c_i], " ");
      }

      // eslint-disable-next-line no-empty-character-class
      text = text.toLowerCase().replace(/[]/g, " ");

      text = text.replace(/\s\s+/g, " ").replace("-", " ").trim();

      return text
    } catch (error) {
      if (this.logger) {
        this.logger.error("NLPError:", text);
      }
    }

    return 'clean';
  }

  public async classifyText(text: string, batchSize = 2, config = "default_model"): Promise<NLPLabel> {
    if (config == "default_model") {
      const _result = await this.classifySentences([text], batchSize = 1, config);
      return _result[0] as NLPLabel
    }

    let sentenceArray: string[] = sentences(text);
    if (text.length >= 50 && text.split(' ').length >= 15 && sentenceArray.length == 1) {
      sentenceArray = sentences(text.replace(',', '.'));
    }

    const sentenceWiseResults = await this.classifySentences(sentenceArray, batchSize, config);

    let finalLabel = "clean";

    sentenceWiseResults.forEach(label => {
      if (label != "clean") {
        finalLabel = label
      }
    });

    return finalLabel as NLPLabel;
  }

  public async findTextToFlag(text: string, batchSize = 2, config = "default_model"): Promise<NLPResult> {
    let sentenceArray: string[] = sentences(text);
    if (text.length >= 50 && text.split(' ').length >= 15 && sentenceArray.length == 1) {
      sentenceArray = sentences(text.replace(',', '.'));
    }

    const sentenceWiseResults = await this.classifySentences(sentenceArray, batchSize, config);

    let finalLabel = "clean";
    let flaggedText = "";
    let currentSentenceIndex = 0;

    sentenceWiseResults.forEach(label => {
      if (finalLabel == "clean" && label != "clean") {
        finalLabel = label;
        flaggedText = sentenceArray[currentSentenceIndex];
      }
      currentSentenceIndex += 1;
    });

    return {flag: finalLabel != "clean", label: finalLabel as NLPLabel, flaggedText: flaggedText};
  }

  public async classifyAsHate(text: string, batchSize = 2): Promise<boolean> {
    return await this.classifyText(text, batchSize, "hate_model") != "clean";
  }

  public async findHate(text: string, batchSize = 2): Promise<NLPResult> {
    return await this.findTextToFlag(text, batchSize, "hate_model")
  }

  public async classifySentences(sentences: string[], batchSize = 2, config = "default_model"): Promise<NLPLabel[]> {
    if (!this.session) {
      throw new Error("Please call init() to initialize the InferenceSession");
    }
    const nlpStart = new Date().getTime()
    const predictedLabels = new Array<NLPLabel>();

    let currentConfig;

    if (config == "hate_model") {
      currentConfig = modelConfig.hate_model;
    } else {
      currentConfig = modelConfig.default_model;
    }

    for (let batch_i = 0; batch_i < sentences.length; batch_i += batchSize) {
      const currentTexts = sentences.slice(batch_i, batch_i + batchSize);

      const preProcessedTexts = new Array<string>();

      currentTexts.forEach(text => {
        preProcessedTexts.push(this.preprocess(text))
      });

      const [input_ids, attention_mask, token_type_ids, batch_len, maxInputLength] = await this.tokenizer.tokenize(preProcessedTexts);

      const onnxInput = {
        input_ids: new Tensor('int64', input_ids as BigInt64Array, [batch_len as number, maxInputLength as number + 2]),
        attention_mask: new Tensor('int64', attention_mask as BigInt64Array, [batch_len as number, maxInputLength as number + 2]),
        token_type_ids: new Tensor('int64', token_type_ids as BigInt64Array, [batch_len as number, maxInputLength as number + 2])
      };

      const _predictedProbs = await this.session.run(onnxInput, ["logits"]);
      const predictedProbs = _predictedProbs["logits"]["data"];

      for (let i = 0; i < predictedProbs.length; i += modelConfig["labels"].length) {
        const currentPredictedProbs = await this.softmax(Array.prototype.slice.call(predictedProbs.slice(i, i + modelConfig["labels"].length)));
        const currentText = preProcessedTexts[i / modelConfig["labels"].length];
        const uniqueWords = new Set(currentText.split(' '));
        const maxProb = Math.max.apply(null, currentPredictedProbs);
        const maxIndex = currentPredictedProbs.indexOf(maxProb);

        let label = modelConfig["labels"][maxIndex];

        let acceptPhraseFoundForLabel;

        for (const [key, value] of Object.entries(modelConfig.accept_phrases)) {
          value.forEach(element => {
            if (element.split(' ').every(elem => uniqueWords.has(elem) || uniqueWords.has(elem + 's'))) {
              acceptPhraseFoundForLabel = key;
            }
          });
        }

        let rejectPhraseFound = false;
        let lowThreshPhraseFound = false;

        const labelConfig = currentConfig[label as keyof typeof currentConfig]

        if (labelConfig != undefined) {
          const defaultThreshold = labelConfig["default_thresh"];
          const lowThreshPhrases = labelConfig["low_thresh_phrases"];
          const rejectPhrases = labelConfig["reject_phrases"];
          const lowThreshValue = labelConfig["low_thresh_value"];

          rejectPhrases.forEach(element => {
            if (element != "." && element.split(' ').every(elem => uniqueWords.has(elem) || uniqueWords.has(elem + 's'))) {
              rejectPhraseFound = true;
            }
          });

          lowThreshPhrases.forEach(element => {
            if (element.split(' ').every(elem => uniqueWords.has(elem) || uniqueWords.has(elem + 's'))) {
              lowThreshPhraseFound = true
            }
          });

          if (!lowThreshPhraseFound) {
            toxicPhrases.forEach(element => {
              if (element.split(' ').every(elem => uniqueWords.has(elem) || uniqueWords.has(elem + 's'))) {
                lowThreshPhraseFound = true
              }
            });
          }

          if (maxProb <= defaultThreshold) {
            if (!(maxProb >= lowThreshValue && lowThreshPhraseFound)) {
              label = "clean";
            }
          }

          if (rejectPhraseFound) {
            label = "clean";
          }

          if (uniqueWords.size <= 2) {
            if (!lowThreshPhraseFound) {
              label = "clean"
            }
          }

        } else {
          label = "clean";
        }

        if (acceptPhraseFoundForLabel != undefined) {
          label = acceptPhraseFoundForLabel;
        }

        if (this.logger) {
          this.logger.debug(`NLP: ${currentText} -> ${preProcessedTexts[i]}, final: ${label}, pred: ${modelConfig['labels'][maxIndex]} ${maxProb}, reject: ${rejectPhraseFound}, accept: ${acceptPhraseFoundForLabel} time: ${new Date().getTime() - nlpStart}`);
        }
        predictedLabels.push(label as NLPLabel);
      }
    }

    return predictedLabels
  }
}

export {NLP, toxicPhrases}
