import React from 'react';

import { Root, TopContentSection, ButtonSection } from '@src/pages/ui-onboarding/GetStartedContainer/SettingsChoice/settingsChoice.style';
import { Props } from '@src/pages/ui-onboarding/GetStartedContainer/SettingsChoice/settingsChoice.type';

const SettingsChoice = ({ advanceToFeedbackScreen, onBoardingComplete, planType }: Props): JSX.Element => {
    return (
        <Root>
            <TopContentSection>
                <img src="/images/getStartedAlt.png" alt="GetStarted alternate image" />
                <div className="content-section">
                    <div className="content-inner-container">
                        <h2>Recommended or custom settings</h2>
                        <div className="points-section">
                            <p>If you'd like to customize some settings, we have some optional questions for you.</p>
                            <p>Choose 'CUSTOMIZE' to do this. It only takes a couple of minutes.</p>
                            <p>Otherwise, click 'RECOMMENDED SETTINGS' and you're all set. Settings can always be changed later.</p>
                        </div>
                    </div>
                </div>
            </TopContentSection>
            <ButtonSection>
                <button
                    title={planType === "FREE" ? "Please upgrade your plan in order to unlock this feature" : ""}
                    disabled={planType === "FREE"}
                    id="customize-btn"
                    data-testid="test-customize-btn"
                    onClick={() => {
                        advanceToFeedbackScreen();
                    }}
                >
                    Customize
                </button>
                <button
                    id="recommended-settings-btn"
                    data-testid="test-recommended-settings-btn"
                    onClick={() => {
                        onBoardingComplete();
                    }}
                >
                    Recommended Settings
                </button>
            </ButtonSection>
        </Root>
    );
};

export default SettingsChoice;
