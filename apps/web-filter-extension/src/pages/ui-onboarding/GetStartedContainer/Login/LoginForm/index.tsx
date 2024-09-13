import {LoadingOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import PinInputField from 'react-pin-field';

import {OnboardingStatus} from '@pages/ui-onboarding/GetStartedContainer/GetStartedContainer.config';
import {
  CustomSpinner,
  ErrorMessageContainer,
  Root
} from '@pages/ui-onboarding/GetStartedContainer/Login/LoginForm/LoginForm.style';
import {Props} from '@pages/ui-onboarding/GetStartedContainer/Login/LoginForm/LoginForm.type';
import {defaultMessages} from '@shared/types/OnboardingMessage';
import {EventType} from '@shared/types/message_types';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';

const LoginForm = ({loginComplete, onboardingFeedbackComplete}: Props): JSX.Element => {
  const logger = ChromeCommonUtils.getLogger();
  const [accessCode, setAccessCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foundCompanionApp, setFoundCompanionApp] = useState<boolean>(false);

  const companionAppId = import.meta.env.WATCHDOG_EXTENSION_ID as string;
  const companionAppUrl = `https://chrome.google.com/webstore/detail/safe-kids-companion/${companionAppId}`;

  useEffect(() => {
    checkForCompanionApp();
    chrome.management.onInstalled.addListener((info) => {
      if (info.id === companionAppId) {
        setFoundCompanionApp(true)
      }
    })
    chrome.management.onDisabled.addListener(async (info) => {
      if (info.id === companionAppId && info.enabled === false) {
        setFoundCompanionApp(false);
      }
    })

  })
  const checkForCompanionApp = () => {
    if (!companionAppId) {
      throw new Error("Please make sure WATCHDOG_EXTENSION_ID is available")
    }
    logger.log("Found companion extension id:" + companionAppId)
    chrome.management.get(companionAppId, (result: chrome.management.ExtensionInfo) => {
      if (result.enabled) {
        setFoundCompanionApp(true)
      }
    })
  }
  const setOnboardingComplete = (plan?: string) => {
    const payload = {type: EventType.SAVE_ONBOARDING_STATUS, status: OnboardingStatus.COMPLETED};
    chrome.runtime.sendMessage(payload, async (response: any) => {
      setLoading(false);
      loginComplete(plan);
    });
  };

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function openInNewTab(url: string) {
    window.open(url, '_blank')?.focus();
  }

  const login = async (accessCode: string) => {
    setError('');
    const LoginEvent = {type: EventType.LOGIN, accessCode};
    setLoading(true);
    chrome.runtime.sendMessage(LoginEvent, async (response: any) => {
      if (!chrome.runtime || chrome.runtime.lastError) {
        await ChromeCommonUtils.timeout(1000);
        login(accessCode);
        return;
      }
      if (!response) {
        setLoading(false);
        setError('Please enter the valid access code!');
      } else {
        const checkFeedbackStatusEvent = {
          type: EventType.GET_ONBOARDING_STATUS,
        };
        chrome.runtime.sendMessage(checkFeedbackStatusEvent, async (response: any) => {
          if (response.status === 'COMPLETED') {
            setLoading(false);
            onboardingFeedbackComplete();
          } else {
            await setOnboardingComplete(response?.planType);
          }
        });
      }
    });
  };
  const antIcon = <LoadingOutlined style={{fontSize: 20}} spin/>;
  const redirectURL = `${import.meta.env.PUBLIC_URL}/signup`;
  return (
    <Root>
      <div className="form-container">
        <div className="form-heading">
          <span>{defaultMessages.getStarted_getCompanionApp}</span>
          <span className="description">{defaultMessages.getStarted_getCompanionApp_description}</span>

          <div className="companion-button-container">
            <button disabled={foundCompanionApp} onClick={() => openInNewTab(companionAppUrl)}>
                            <span data-testid="test-btn-login-nextBtn" className="text">
                                {foundCompanionApp ? defaultMessages.getStarted_gotCompanionApp_button : defaultMessages.getStarted_getCompanionApp_button}
                            </span>
            </button>
          </div>
        </div>
        <div className="form-heading">
          <span>{defaultMessages.getStarted_login}</span>
          <span className="description">{defaultMessages.getStarted_enter_code_paragraph}</span>
          <div className="form-field">
            <span>{defaultMessages.loginForm_accessCode}</span>
            <div className="access-code-container">
              <PinInputField className="pin-input-field" length={6} onChange={setAccessCode}
                             validate={/^[a-zA-Z0-9]$/}/>
            </div>
          </div>
          <p>
            {defaultMessages.getStarted_redirect_signup}
            <a target="_blank" href={redirectURL} rel="noreferrer">
              {redirectURL?.replace('https://', ' ')}
            </a>
          </p>
          <div className="button-container">
            <button disabled={accessCode.length !== 6 || !foundCompanionApp}
                    onClick={async () => await login(accessCode)}>
                    <span data-testid="test-btn-login-nextBtn" className="text">
                        {defaultMessages.getStarted_enter_code_btn_text}
                    </span>
              {loading && <CustomSpinner indicator={antIcon}/>}
            </button>
          </div>
        </div>
        <ErrorMessageContainer error={error}>
          <span className="error-msg">{error}</span>
        </ErrorMessageContainer>
      </div>

    </Root>
  );
};

export default LoginForm;
