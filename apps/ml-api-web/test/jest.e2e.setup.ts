/**
 * Check the images of the page
 * get their data-nsfw-fillter-status attributes and return them from the page
 */

import 'expect-puppeteer';

export const setupEnv = async () => {
    let URLS: any[] = [''];
    let env: string|undefined = process.env.npm_config_env;
    if(env==='dev' || env==='development'){
        process.env.BACKEND_URL = `https://api.safekids.dev/`;
        process.env.FRONTEND_URL = 'https://safekids.dev/';
    }else if (env === 'local' || env===undefined){
        process.env.BACKEND_URL = `http://localhost:3000/`;
        process.env.FRONTEND_URL = `http://localhost:5200/`;
    }
    else if (env === 'stage' || 'staging'){
        process.env.BACKEND_URL = `https://staging-api.safekids.ai/`;
        process.env.FRONTEND_URL = `https://staging.safekids.ai/`;
    }else if(env === 'prod' || 'production'){
        process.env.BACKEND_URL = `https://api.safekids.ai/`;
        process.env.FRONTEND_URL = `https://app.safekids.ai/`;
    }

    URLS[0] = process.env.BACKEND_URL;
    URLS[1] = process.env.FRONTEND_URL;
    return URLS;
}

