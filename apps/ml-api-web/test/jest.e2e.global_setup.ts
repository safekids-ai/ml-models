import path from 'path';
import fs from 'fs';
import os from 'os';
import mkdirp from 'mkdirp';
import puppeteer, { Browser, Page } from 'puppeteer';
import {SignUpHelper} from "./e2e/common/SignUpHelper";
import {setupEnv} from "./jest.e2e.setup";
import {Urls} from "./e2e/common/Urls";

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

module.exports = async function () {
    console.log('Puppeteer running chrome path:' + process.env.PUPPETEER_EXEC_PATH);
    const browser = await puppeteer.launch({
        headless: false,
        product: 'chrome',
        executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
        defaultViewport: null,
        args: [`--disable-dev-shm-usage`, `--no-sandbox`, `--disable-setuid-sandbox`],
    });
    console.log('Chrome browser launched');
    // store the browser instance so we can teardown it later
    // this global is only available in the teardown but not in TestEnvironments
    // wait one minute for extension to load
    // @ts-ignore
    global.__BROWSER_GLOBAL__ = browser;

    // use the file system to expose the wsEndpoint for TestEnvironments
    mkdirp.sync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
    // let page = await browser.newPage();
    await delay(5000);

    let URLS: string[] =await setupEnv();
    let signUpUrl = await Urls.setupSignUpURL(URLS[1])
    let signInUrl = await Urls.setupSignInURL(URLS[1])
    const signUpHelper = new SignUpHelper(browser);
    await signUpHelper.testSignUp(signUpUrl,signInUrl);


};
