import path from 'path';
import os from 'os';
import rimraf from 'rimraf';
import {Util} from './e2e/common/Util';

let util = new Util();
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
module.exports = async function () {
    // close the browser instance
    await util.deleteAccount("uzair@gmail.com","S@feKids1");
    // @ts-ignore
    await global.__BROWSER_GLOBAL__.close();

    // clean-up the wsEndpoint file
    rimraf.sync(DIR);
};

