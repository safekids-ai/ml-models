import {cleanup} from "@testing-library/react";
import {ChromeCommonUtils} from "../../../../src/shared/chrome/utils/ChromeCommonUtils";
import {HttpUtils} from "../../../../src/shared/utils/HttpUtils";

describe('Use Language Message', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Should load message json', () => {
        const sampleJSON = {"prr1.screen1.tellMeMore": "Tell me more",
            "prr1.screen2.mistake": "If you think we made a mistake by intercepting this site,",
            "prr1.screen2.letUsKnow": "let us know.",
            "prr1.feedback.message": "We'll take a look at this site to see why we thought it was a problem.",
            "prr1.feedback.thanks": "Thanks for your feedback."};

        const defaultLanguage = { name: 'English', id: 'en', direction: 'ltr' };
        jest.spyOn(ChromeCommonUtils,"readLocalStorage").mockResolvedValue(defaultLanguage);
        jest.spyOn(HttpUtils,"loadJson").mockResolvedValue(sampleJSON);

    });
});
