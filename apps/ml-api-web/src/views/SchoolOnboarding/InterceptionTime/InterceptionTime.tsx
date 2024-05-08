import {Switch, TextField} from '@mui/material';
import {TimePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {SubmitButton} from '../../../components/InputFields';
import {getRequest, patchRequest, postRequest} from '../../../utils/api';
import {
  GET_INTERCEPTION_CATEGORIES,
  GET_INTERCEPTION_TIMES,
  PATCH_INTERCEPTION_CATEGORIES,
  POST_INTERCEPTION_TIME
} from '../../../utils/endpoints';
import {logError} from '../../../utils/helpers';
import {Props} from './InterceptionTime.types';
import {format} from 'date-fns';
import {useNotificationToast} from '../../../context/NotificationToastContext/NotificationToastContext';

const Root = styled.div`
  display: flex;
  width: 630px;
  position: relative;
  flex-direction: column;

  & .MuiDialog-paperWidthSm {
    max-width: unset;
  }

  & form {
    width: 400px;

    & > div {
      margin: 8px 0;
    }
  }
`;

const Title = styled.span<{ isSettings: boolean | undefined }>`
  display: flex;
  align-items: center;
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 900;
  font-size: ${(props: any) => (props.isSettings ? '15px' : '28px')};
  line-height: 35px;
  letter-spacing: -0.25px;
  color: #4a4a4a;
`;

const Description = styled.span`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 15px;
  color: #000000;
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 0;

  & span {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #4a4a4a;
  }

  & .MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track {
    background-color: #979797;
    border-color: #979797;
  }
`;

const CategoryName = styled.span`
  margin-bottom: 1.75px;
  margin-left: 5px;
  margin-right: 20px;
`;

const Categories = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const ContinueButton = styled.div`
  margin-top: 50px !important;
  width: 400px;

  & button {
    margin-top: 0;
  }

  & .MuiButton-label {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;
  }
`;

const TimeTitle = styled.div`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  color: #000000;
`;

const TimeDescription = styled.div`
  margin-top: 2px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
`;

const TimePickerContainer = styled.div`
  margin-top: 10px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;

  & .MuiTextField-root {
    border: 1px solid #dfe1e6;
    border-radius: 7px;
    width: 280px;
  }

  & .MuiInput-underline:after,
  .MuiInput-underline:before {
    display: none;
  }

  & input {
    padding: 15px 23px;
  }
`;

const NoteContainer = styled.div`
  height: 20px;
  margin-bottom: 25px;
`;

const Note = styled.span`
  color: #f7274a;
`;

const SaveButton = styled.div`
  width: 120px;
  position: absolute;
  bottom: 22px;
  left: 700px;

  & button {
    margin-top: 0;
  }

  & .MuiButton-label {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;
  }
`;

const InterceptionTime = ({nextStep, isSettings}: Props) => {
  const categoryList = [
    {key: 'ONLINE_GAMING', name: 'Online Gaming'},
    {key: 'SOCIAL_MEDIA_CHAT', name: 'Social Media and Chat'},
  ];
  const [schoolStartTime, setSchoolStartTime] = useState<any>();
  const [schoolEndTime, setSchoolEndTime] = useState<any>();
  const [lightOffStartTime, setLightOffStartTime] = useState<any>();
  const [lightOffEndTime, setLightOffEndTime] = useState<any>();
  const [interceptionCategories, setInterceptionCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<any>();
  const {showNotification} = useNotificationToast();

  useEffect(() => {
    getRequest<{}, any>(GET_INTERCEPTION_TIMES, {})
      .then((res: any) => {
        const today = new Date();
        setSchoolStartTime(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDay(),
            res.data.schoolStartTime ? res.data.schoolStartTime.split(':')[0] : '08',
            res.data.schoolStartTime ? res.data.schoolStartTime.split(':')[1] : '00',
            res.data.schoolStartTime ? res.data.schoolStartTime.split(':')[2] : '00',
          ),
        );
        setSchoolEndTime(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDay(),
            res.data.schoolEndTime ? res.data.schoolEndTime.split(':')[0] : '15',
            res.data.schoolEndTime ? res.data.schoolEndTime.split(':')[1] : '00',
            res.data.schoolEndTime ? res.data.schoolEndTime.split(':')[2] : '00',
          ),
        );
        setLightOffStartTime(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDay(),
            res.data.lightOffStartTime ? res.data.lightOffStartTime.split(':')[0] : '21',
            res.data.lightOffStartTime ? res.data.lightOffStartTime.split(':')[1] : '00',
            res.data.lightOffStartTime ? res.data.lightOffStartTime.split(':')[2] : '00',
          ),
        );
        setLightOffEndTime(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDay(),
            res.data.lightOffEndTime ? res.data.lightOffEndTime.split(':')[0] : '06',
            res.data.lightOffEndTime ? res.data.lightOffEndTime.split(':')[1] : '00',
            res.data.lightOffEndTime ? res.data.lightOffEndTime.split(':')[2] : '00',
          ),
        );
        setInitialData(res.data);
      })
      .catch((err) => {
        logError('GET NON SCHOOL DAYS', err);
      });
    getRequest<{}, any[]>(GET_INTERCEPTION_CATEGORIES, {})
      .then((res: any) => setInterceptionCategories(res.data.interceptionCategories))
      .catch((err) => {
        logError('GET NON SCHOOL DAYS CONFIG', err);
      });
  }, []);

  const toggleCategory = (categoryName: string, value: boolean) => {
    const newCategories = interceptionCategories ? [...interceptionCategories] : [];
    value ? newCategories.push(categoryName) : newCategories.splice(newCategories.indexOf(categoryName), 1);
    setInterceptionCategories(newCategories);
    updateCategories(newCategories);
  };

  const updateCategories = (payload: string[]) => {
    patchRequest<{}, any[]>(PATCH_INTERCEPTION_CATEGORIES, {
      interceptionCategories: payload,
    }).catch((err) => {
      logError('PATCH INTERCEPTION CATEGORIES', err);
    });
  };

  const onContinue = () => {
    const payload: any = {
      schoolStartTime: format(schoolStartTime, 'HH:mm'),
      schoolEndTime: format(schoolEndTime, 'HH:mm'),
      lightOffStartTime: format(lightOffStartTime, 'HH:mm'),
      lightOffEndTime: format(lightOffEndTime, 'HH:mm'),
      statusId: 'ACTIVE',
    };
    if (initialData.id) {
      payload['id'] = initialData.id;
    }
    postRequest<{}, any[]>(POST_INTERCEPTION_TIME, payload)
      .then(() => {
        if (isSettings) {
          showNotification({type: 'success', message: 'Interception Times updated successfully.'});
        }
        nextStep?.();
      })
      .catch((err) => {
        showNotification({type: 'error', message: 'Failed to update Interception Times.'});
        logError('POST NON SCHOOL DAYS', err);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Root>
      <Title isSettings={isSettings}>Interception Time</Title>
      <Description>
        By default, all previously chosen categories <b>are not available during school hours</b>, but schools may wish
        to allow kids to play games or
        engage with social networks after school hours.{' '}
      </Description>
      <Categories>
        <CategoryContainer>
          <Switch
            checked={interceptionCategories?.includes('ONLINE_GAMING')}
            onChange={(evt) => toggleCategory('ONLINE_GAMING', evt.target.checked)}
          />
          <CategoryName>Online Gaming</CategoryName>
        </CategoryContainer>
        <CategoryContainer>
          <Switch
            checked={interceptionCategories?.includes('SOCIAL_MEDIA_CHAT')}
            onChange={(evt) => toggleCategory('SOCIAL_MEDIA_CHAT', evt.target.checked)}
          />
          <CategoryName>Social Media and Chat</CategoryName>
        </CategoryContainer>
      </Categories>
      <NoteContainer>
        {interceptionCategories?.length === 0 ? (
          <span>
                        <Note>NOTE: </Note>You have disabled both categories so the rest of the functions on this screen are unnecessary.
                    </span>
        ) : interceptionCategories?.length === 1 ? (
          <span>
                        <Note>NOTE: </Note>
            {`You have disabled ${
              categoryList.find((category) => category.key !== interceptionCategories[0])?.name
            } so the following settings will only apply to ${categoryList.find((category) => category.key === interceptionCategories[0])?.name}.`}
                    </span>
        ) : (
          <></>
        )}
      </NoteContainer>
      <TimeTitle>SCHOOL DAY TIMES</TimeTitle>
      <TimeDescription>
        Please confirm a general set of school hours for your district. Schools will have options to revise as needed
        later.{' '}
      </TimeDescription>
      <TimePickerContainer>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="School Start Time"
            value={schoolStartTime}
            onChange={(value: any) => {
              setSchoolStartTime(value);
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider>
          <TimePicker
            label="School End Time"
            value={schoolEndTime}
            onChange={(value: any) => setSchoolEndTime(value)}/>
        </LocalizationProvider>
      </TimePickerContainer>
      <TimeTitle>LIGHTS-OFF TIME</TimeTitle>
      <TimeDescription>
        Our system reverts to the interception <b>of all previously selected</b> categories for lights-off time.
      </TimeDescription>
      <TimePickerContainer>
        <LocalizationProvider>
          <TimePicker
            label="Day End" value={lightOffStartTime}
            onChange={(value: any) => setLightOffStartTime(value)}/>
        </LocalizationProvider>
        <LocalizationProvider>
          <TimePicker label="Day Start" value={lightOffEndTime}
                      onChange={(value: any) => setLightOffEndTime(value)}/>
        </LocalizationProvider>
      </TimePickerContainer>
      {isSettings ? (
        <SaveButton>
          <SubmitButton isSubmitting={isSubmitting} text="Save" onClick={() => onContinue()}/>
        </SaveButton>
      ) : (
        <ContinueButton>
          <SubmitButton isSubmitting={isSubmitting} text="Continue" onClick={() => onContinue()}/>
        </ContinueButton>
      )}
    </Root>
  );
};

export default InterceptionTime;
