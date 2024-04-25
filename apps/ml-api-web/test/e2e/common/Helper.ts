import { Page } from 'puppeteer';
import { Util } from './Util';

export class Helper {
    static readonly prrTriggerModelCSSSelector: string = '#prr-trigger-model';
    static readonly ENABLE_EXTENSION: string = "//span[text()='Enable Extension']/preceding-sibling::span//input[@type='checkbox']";
    static readonly ENABLE_ACCESS: string = "//button[text()='Enable Access']";
    private util: Util = new Util();
}
