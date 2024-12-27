import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';
import {Footer} from '@src/components/Footer';
import {Header} from '@src/components/Header';
import {Production} from '@src/components/Production';
import {BottomContainer, Container, CustomSpinner, PopupSpinnerContainer} from '@src/components/popup.styles';
import {RootState} from '@shared/redux/reducers';
import {SettingsState} from '@shared/redux/reducers/settings';
import {ResumeOnboardingPopup} from '@src/components/ResumeOnboardingPopup';
import {ChromeCommonUtils} from "@shared/chrome/utils/ChromeCommonUtils";

export const Popup: React.FC = () => {
  const {prodEnvironment, environment} = useSelector<RootState>((state) => state.settings) as SettingsState;
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  useEffect(() => {
    checkUserCredentials();
  }, []);
  const checkUserCredentials = async () => {
    setLoading(true);
    const res = await ChromeCommonUtils.getUserCredentials().catch((e) => {
    });
    if (res && res?.accessCode) {
      setIsLoggedIn(true);
    } else {
      setLoading(false);
    }
  };

  const antIcon = <LoadingOutlined style={{fontSize: 48}} spin/>;

  if (!isLoggedIn) {
    return (
      <Container isOnBoarding>
        <Header/>
        {!loading ? (
          <>
            <ResumeOnboardingPopup isLoggedIn={isLoggedIn}/>
            <BottomContainer>
              <p>Stay curious, stay safe.</p>
            </BottomContainer>
          </>
        ) : (
          <PopupSpinnerContainer>
            <CustomSpinner indicator={antIcon}/>
          </PopupSpinnerContainer>
        )}
      </Container>
    );
  } else {
    if (environment === 'development') {
      return (
        <Container>
          <Header/>
          <Production/>
          <Footer/>
        </Container>
      );
    }

    return (
      <Container>
        <Header/>
        <Footer/>
      </Container>
    );
  }
};
