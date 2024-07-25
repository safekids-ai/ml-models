import { Logger } from '@src/shared/logging/ConsoleLogger';
import { PredictionRequest, PredictionResponse } from '@src/shared/types/messages';
import { HttpUtils } from '@src/shared/utils/HttpUtils';

import { Filter, FilterSettingsType, IObjectFilter } from './Filter';

export class TextFilter extends Filter implements IObjectFilter {
    private readonly NLP_THRESHOLD: number;
    private settings: FilterSettingsType = {
        filterEffect: 'blur',
        analyzeLimit: 0,
        environment: 'develop',
    };

    private readonly elements: Set<string>;

    constructor(logger: Logger) {
        super(logger);
        this.NLP_THRESHOLD = 0.005;
        this.elements = new Set();
    }

    public analyze(element: HTMLElement): void {
        if (element?.tagName.toUpperCase() === 'A') {
            const a = element as HTMLAnchorElement;
            if (a.href === '' || a.innerText === '') {
                return;
            }
        }
        if (!element) {
            return;
        }

        let text = element.innerText || element.textContent;

        if (!!!text) {
            return;
        }
        text = text?.trim();
        if ((element.dataset.nlpStatus === undefined || element.dataset.nlpStatus === 'done') && !!text && text.length > 0) {
            element.dataset.nlpStatus = 'processing';
            this._analyzeText(element, text);
            if (element.dataset.nlpStatus === 'processing') {
                element.dataset.nlpStatus = 'done';
            }
        }
    }

    private _analyzeText(element: HTMLElement, text: string): void {
        if (element.className === 'sk-level1-pr') return;

        if (text.toLowerCase() !== element.title.trim().toLowerCase()) {
            const title = element.title !== '' ? element.title : '';
            text = text + ' ' + title;
        }
        text = text.replace(/(\r\n|\n|\r)/gm, ' ');

        text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

        text = text.replace(/\s\s+/g, ' ').trim();
        if (text.length > 200) {
            text = text.substring(0, 200);
        }
        if (text.length < 10 || text.length > 200 || text.replace(/[0-9]/g, '').replace('.', '').replace(/\s\s+/g, ' ').trim().split(' ').length < 5) return;

        if (this.elements.has(text)) {
            return;
        }
        this.elements.add(text);
        const MAX_LIMIT = this.settings.processLimit;
        if (MAX_LIMIT && this.counter >= MAX_LIMIT) {
            this.counter = 0;
            this.logger.debug(`Text elements count = ${MAX_LIMIT}, set counter to ${this.counter}`);
        }

        if (this.counter++ >= this.settings.analyzeLimit) {
            return;
        }
        this.logger.debug(`Sending NLP Request # ${this.counter - 1} ,${text},status:${element.dataset.nlpStatus}`);
        const value = new PredictionRequest(text, 'ANALYZE_TEXT', 'NLP', window.location.href);
        const request = { type: 'ANALYZE_TEXT', value };
        chrome.runtime.sendMessage(request, (response: PredictionResponse) => {
            if (chrome.runtime.lastError !== null && chrome.runtime.lastError !== undefined) {
                return;
            }
            if (!response.prediction) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this.logger.debug(`TEXT: ${text} LABEL: ${response?.prediction?.toString().toUpperCase()}`);

            if (response.prediction === 'PORN') {
                this.violationCounter++;
                element.dataset.nlpStatus = 'porn';
                this.logger.debug(`Explicit text Count: ${this.violationCounter}`);
                if (this.settings.environment === 'development') {
                    show();
                }
            } else if (response.prediction === 'WEAPONS') {
                this.violationCounter++;
                element.dataset.nlpStatus = 'weapon';
                this.logger.debug(`Explicit text Count: ${this.violationCounter}`);
                if (this.settings.environment === 'development') {
                    show();
                }
            } else if (response.prediction === 'PROXY') {
                this.violationCounter++;
                element.dataset.nlpStatus = 'proxy';
                this.logger.debug(`Explicit text Count: ${this.violationCounter}`);
                if (this.settings.environment === 'development') {
                    show();
                }
            } else if (response.prediction === 'SELF_HARM') {
                this.violationCounter++;
                element.dataset.nlpStatus = 'proxy';
                if (this.settings.environment === 'development') {
                    show();
                }
            } else {
                element.dataset.nlpStatus = 'clean';
                if (this.settings.showClean && this.settings.environment === 'development') {
                    show();
                }
            }

            function show() {
                const result: string = HttpUtils.formatResultHTML(response.prediction);
                const elem = document.createElement('div');
                elem.innerHTML = result;
                const parentDiv = element.parentNode;
                if (parentDiv instanceof Node) {
                    parentDiv?.insertBefore(elem, element);
                }
            }
        });
    }

    setSettings(settings: FilterSettingsType): void {
        this.settings = settings;
    }
}
