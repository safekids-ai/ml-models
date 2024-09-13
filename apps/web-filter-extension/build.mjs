import {build} from 'vite';
import backgroundConfig from './vite.config.background.mjs';
// import contentConfig from './vite.config.content.mjs';
// import popupConfig from './vite.config.popup.mjs';
// import uiOnboardingConfig from './vite.config.ui-onboarding.mjs';
// import uiPrrConfig from './vite.config.ui-prr.mjs';

async function runBuilds() {
  try {
    await build(backgroundConfig);
    console.log('Background build completed');
    //
    // await build(contentConfig);
    // console.log('Content build completed');
    //
    // await build(popupConfig);
    // console.log('Popup and pages build completed');
    //
    // await build(uiOnboardingConfig);
    // console.log('UI Onboarding build completed');
    //
    // await build(uiPrrConfig);
    // console.log('UI PRR build completed');
  } catch (error) {
    console.error('Build error:', error);
    process.exit(1);
  }
}

runBuilds();
