import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {EventType} from "@shared/types/message_types";
import {
  setExtensionEnabled,
  toggleBlocker,
  toggleDebug,
  toggleDemo,
  toggleLogging,
  toggleNPL,
  togglePRTrigger,
  toggleRunML,
  toggleShowClean,
} from '@shared/redux/actions/settings';
import {RootState} from '@shared/redux/reducers';
import {SettingsState} from '@shared/redux/reducers/settings';

import {CheckboxArea, Container, StyledCheckbox} from '@src/components/Footer/styles';

export const Footer: React.FC = () => {
  const dispatch = useDispatch();

  function enableAccess(): void {
    chrome.runtime.sendMessage(
      {
        type: 'LIMIT_ACCESS',
        value: false,
      }
    );
  }

  const deleteExtension = (): void => {
    chrome.runtime.sendMessage(
      {
        type: EventType.DELETE_EXTENSION,
        value: true,
      }
    );
  }
  const {
    environment,
    debug,
    logging,
    mlEnabled,
    enablePRTrigger,
    nlpEnabled,
    showClean,
    enableBlocker,
    enableDemo,
    extensionEnabled
  } =
    useSelector<RootState>((state) => state.settings) as SettingsState;

  const [message] = React.useState('');
  const [showMessage] = React.useState(false);

  if (environment === 'demo') {
    return (
      <Container>
        <p>This is an evaluation version.</p>
        <div>
          {<p>If you lose access due to too many intercepts, choose &#39;Enable Access&#39; to continue.</p>}
          {!showMessage && (
            <button style={{width: '100%'}} value="Enable Access" onClick={() => enableAccess()}>
              Enable Access
            </button>
          )}
          {showMessage && <p>{message}</p>}
        </div>
      </Container>
    );
  }
  if (environment !== 'development' && environment !== 'test') {
    return <Container></Container>;
  }

  return (
    <Container>
      <CheckboxArea>
        <StyledCheckbox checked={enableBlocker} onChange={() => dispatch(toggleBlocker())}>
          {'Enable URL Blocker'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={enablePRTrigger} onChange={() => dispatch(togglePRTrigger())}>
          {'Enable PR Trigger'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={mlEnabled} onChange={() => dispatch(toggleRunML())}>
          {'Enable ML'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={nlpEnabled} onChange={() => dispatch(toggleNPL())}>
          {'Enable NLP'}
        </StyledCheckbox>
        <StyledCheckbox checked={showClean} onChange={() => dispatch(toggleShowClean())}>
          {'Show "Clean" category'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={logging} onChange={() => dispatch(toggleLogging())}>
          {'Show logs in browser console'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={debug} onChange={() => dispatch(toggleDebug())}>
          {'Enable debug mode'}
        </StyledCheckbox>
      </CheckboxArea>
      <CheckboxArea>
        <StyledCheckbox checked={enableDemo} onChange={() => dispatch(toggleDemo())}>
          {'Enable Demo mode'}
        </StyledCheckbox>
      </CheckboxArea>
      <div>
        <button data-testid="enableAccessButton" value="Enable Access" onClick={() => enableAccess()}>
          Enable Access
        </button>
        {' '}
      </div>
      <CheckboxArea>
        <StyledCheckbox data-testid="extensionEnabledCB" checked={extensionEnabled}
                        onChange={() => dispatch(setExtensionEnabled(!extensionEnabled))}>
          {'Enable Extension'}
        </StyledCheckbox>
      </CheckboxArea>
      <div>
        <button value="Delete Extension" onClick={() => deleteExtension()}>
          Delete Extension
        </button>
        {' '}
      </div>
    </Container>
  );
};
