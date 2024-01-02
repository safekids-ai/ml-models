import {chrome} from 'jest-chrome';
import {NLPModelWrapper} from "./NLPModelWrapper";
import {NLPModelInterface} from "./NLPModelInterface";
import {ILogger, Logger} from "../../../common/utils/Logger";

const logger = new Logger();

describe("NLPModelWrapper => utils functions", () => {

    test('getSentencesIncludeToxicWords1', async () => {
        const text = "There is a girl who keeps trying to seduce me even though I don't reciprocate her advances. I think she's a whore.";
        const toxicWords = ["whore"];
        const sentences = NLPModelWrapper.getSentencesIncludeToxicWords(text, toxicWords);
        expect(sentences.length).toBe(1);
        expect(sentences[0]).toBe("I think she's a whore");
    });

    test('getSentencesIncludeToxicWords2', async () => {
        const text = "";
        const toxicWords = ["whore"];
        const sentences = NLPModelWrapper.getSentencesIncludeToxicWords(text, toxicWords);
        expect(sentences.length).toBe(0);
    });

    test('getSentencesIncludeToxicWords3', async () => {
        const text = "There is a girl who keeps trying to seduce me even though I don't reciprocate her advances. I think she's a whore and a bitch.";
        const toxicWords = ["whore"];
        const sentences = NLPModelWrapper.getSentencesIncludeToxicWords(text, toxicWords);
        expect(sentences[0]).toBe("I think she's a whore and a bitch");
    });

    test('getSentencesIncludeToxicWords4', async () => {
        const text = "There is a girl who keeps trying to seduce me even though I don't reciprocate the bitch but who knows. I think she's a whore and a bitch.";
        const toxicWords = ["whore", "bitch"];
        const sentences = NLPModelWrapper.getSentencesIncludeToxicWords(text, toxicWords);
        expect(sentences.length).toBe(2);
        expect(sentences[0]).toBe("I think she's a whore and a bitch");
        expect(sentences[1]).toBe("There is a girl who keeps trying to seduce me even though I don't reciprocate the bitch but who knows");
    });

    test('getSentence', async () => {
        const mockNlp = {
            isHate: jest.fn((text) => new Promise((resolve) => resolve(false))),
            version: jest.fn(() => "1.0")
        } as NLPModelInterface;
        const model = await new NLPModelWrapper(logger, mockNlp, [""]);

        expect(model.getSentence("this should be clean", "this should be clean".length))
            .toBe("this should be clean");

        expect(model.getSentence("this should be clean", "this should".length))
            .toBe("this should");

        expect(model.getSentence("just die right now... you fuck", "just die right now... you fuck".length))
            .toBe("just die right now... you fuck");

        expect(model.getSentence("You should just kill yourself now", "You should just kill yourself now".length))
            .toBe("You should just kill yourself now");

        expect(model.getSentence("this should be clean", 9))
            .toBe("this");
    });
});

describe("NLPModelWrapper => isToxic", () => {
    test('isToxic-simple-clean', async () => {
        const mockNlp = {
            isHate: jest.fn((text) => new Promise((resolve) => resolve(false))),
            version: jest.fn(() => "1.0")
        } as NLPModelInterface;
        const model = await new NLPModelWrapper(logger, mockNlp, [""]);
        expect(await model.isToxic("this should be clean")).toBe(false);
    });

    test('isToxic-simple-toxic', async () => {
        const mockNlp = {
            isHate: jest.fn((text) => new Promise((resolve) => resolve(true))),
            version: jest.fn(() => "1.0")
        } as NLPModelInterface;
        const model = await new NLPModelWrapper(logger, mockNlp, [""]);
        expect(await model.isToxic("this should not be clean")).toBe(true);
    });

    test('isToxic-complex', async () => {
        const cleanSentence = "my clean sentence";
        const toxicSentence = "my toxic sentence";
        const sentence = cleanSentence + " " + toxicSentence;

        const mockNlp = {
            isHate: jest.fn((text) => new Promise((resolve) => {
                console.log(text);
                if (text === cleanSentence) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })),
            version: jest.fn(() => "1.0")
        } as NLPModelInterface;

        //test if not toxic words
        const model = await new NLPModelWrapper(logger, mockNlp, ["toxic"]);
        expect(await model.isToxic(sentence, cleanSentence.length)).toBe(false);
        expect(await model.isToxic(sentence, cleanSentence.length, true)).toBe(true);
    });


    test('isToxic-partial', async () => {
        const sentence = "This is a simple sentence that needs to be analyzed";

        const mockNlp = {
            isHate: jest.fn((text) => new Promise((resolve) => {
                console.log(text);
                if (text === "This is a simple sentence") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })),
            version: jest.fn(() => "1.0")
        } as NLPModelInterface;

        //test if not toxic words
        const model = await new NLPModelWrapper(logger, mockNlp, [""]);

        //should truncate to the last word
        expect(await model.isToxic(sentence, "This is a simple sentence th".length)).toBe(false);
        expect(await model.isToxic(sentence, "This is a simple sentence".length)).toBe(false);

        //should realize that "that" should be included
        expect(await model.isToxic(sentence, "This is a simple sentence isn't it".length)).toBe(true);
        expect(await model.isToxic(sentence, "This is a simple sentence that ne".length)).toBe(true);
    });
});
