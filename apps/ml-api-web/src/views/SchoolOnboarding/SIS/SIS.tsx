import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputField, PasswordField, SubmitButton } from '../../../components/InputFields';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';
import { HelpIcon } from '../../../svgs/SchoolOnboarding';
import { getRequest, postRequest, putRequest } from '../../../utils/api';
import { GET_STUDENT_INFORMATION, UPDATE_STUDENT_INFORMATION, POST_STUDENT_INFORMATION, UPDATE_JOB_STATUS, GET_JOB_STATUS } from '../../../utils/endpoints';
import { logError, extractErrors } from '../../../utils/helpers';
import { validateURL } from '../../../utils/validations';
import { JobStatus, JobTypes } from '../../Dashboard/components/SchoolSettings/SchoolSettings.types';

import FeatureDescriptionDialog from '../FeatureDescriptionDialog/FeatureDescriptionDialog';
import { FeatureDescriptions } from '../SchoolOnboardingConstants';

import { DataType, Props } from './SIS.types';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
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

const ContinueButton = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
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

const HelpContainer = styled.div`
    display: flex;
    cursor: pointer;
    & svg {
        margin-left: 8px;
        margin-bottom: 5px;
    }
`;

const SaveButton = styled.div`
    width: 120px;
    position: absolute;
    bottom: 0;
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

const SkipText = styled.span`
    margin-top: 20px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 2.5px;
    cursor: pointer;
`;

const SyncButton = styled.div`
    button,
    button.Mui-disabled {
        margin-top: 0;
        position: absolute;
        width: 130px;
        top: 0;
        right: 0;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
        }
        height: 60px !important;
        background-color: #282828;
        color: white;
        font-size: 15px;
        height: 52px;
        letterspacing: 1.25;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
        box-shadow: none;
    }
`;

const SIS = ({ nextStep, isSettings, showSync }: Props) => {
    const [showFeatureDescription, setShowFeatureDescription] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<DataType>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { showNotification } = useNotificationToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getRequest<{}, DataType>(GET_STUDENT_INFORMATION, {})
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                logError('GET STUDENT INFORMATION', err);
            });
    }, []);

    const onContinue = (values: DataType, helpers: FormikHelpers<DataType>) => {
        if (initialData?.id) {
            putRequest<{}, any[]>(UPDATE_STUDENT_INFORMATION.replace('{id}', initialData?.id || ''), {
                ...values,
                service: 'oneroaster',
            })
                .then(() => {
                    if (isSettings) {
                        showNotification({ type: 'success', message: 'Student Information updated successfully.' });
                    }
                    nextStep?.();
                })
                .catch((err) => {
                    showNotification({
                        type: 'error',
                        message: err?.response?.data?.message ? 'Failed to update Student Information.' : 'Invalid Credentials.',
                    });
                    logError('UPDATE STUDENT INFORMATION', err);
                })
                .finally(() => helpers.setSubmitting(false));
        } else {
            postRequest<{}, any[]>(POST_STUDENT_INFORMATION, {
                ...values,
                service: 'oneroaster',
            })
                .then(() => nextStep?.())
                .catch((err) => {
                    showNotification({
                        type: 'error',
                        message: err?.response?.data?.message ? 'Failed to update Student Information.' : 'Invalid Credentials.',
                    });
                    logError('POST STUDENT INFORMATION', err);
                })
                .finally(() => helpers.setSubmitting(false));
        }
    };

    const sync = () => {
        setIsLoading(true);
        postRequest<{}, any>(UPDATE_JOB_STATUS, {
            status: JobStatus.STARTED,
            type: JobTypes.SIS,
        })
            .then((res) => {
                const polling = setInterval(() => {
                    getRequest<{}, any>(GET_JOB_STATUS.replace('{jobId}', res.data.id), {})
                        .then((response) => {
                            if (response.data.status === JobStatus.FAILED) {
                                showNotification({ type: 'error', message: response.data.remarks });
                                setIsLoading(false);
                                clearInterval(polling);
                            } else if (response.data.status === JobStatus.COMPLETED) {
                                showNotification({
                                    type: 'success',
                                    message: response.data.remarks,
                                });
                                setIsLoading(false);
                                clearInterval(polling);
                            }
                        })
                        .catch((err) => {
                            clearInterval(polling);
                            showNotification({ type: 'error', message: 'Synchorinzation Failed.' });
                            logError('GET JOB STATUS', err);
                        });
                }, 3000);
            })
            .catch((err) => {
                setIsLoading(false);
                showNotification({ type: 'error', message: 'Synchorinzation Failed.' });
                logError('UPDATE JOB STATUS', err);
            });
    };

    return (
        <>
            <Root>
                <Title isSettings={isSettings}>
                    Student Information System (SIS){' '}
                    <HelpContainer onClick={() => setShowFeatureDescription(true)}>
                        <HelpIcon />
                    </HelpContainer>
                </Title>
                <Description>Please tell us the following information</Description>
                <Formik
                    enableReinitialize
                    onSubmit={onContinue}
                    initialValues={{
                        hostUrl: initialData?.hostUrl || '',
                        accessKey: initialData?.accessKey || '',
                        secret: initialData?.secret || '',
                    }}
                    validateOnMount
                    validateOnChange
                    validate={(values) => {
                        const errors: FormikErrors<DataType> = {};
                        errors.hostUrl = !values.hostUrl ? 'Please enter Host URL' : validateURL(values.hostUrl);
                        errors.accessKey = !values.accessKey ? 'Please enter Access Key' : undefined;
                        errors.secret = !values.secret ? 'Please enter Secret Code' : undefined;
                        return extractErrors(errors);
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form>
                            <InputField name="hostUrl" label="Host URL" />
                            <InputField name="accessKey" label="Access Key" />
                            <PasswordField name="secret" label="Secret Code" />
                            {isSettings ? (
                                <SaveButton>
                                    <SubmitButton isSubmitting={isSubmitting} disabled={!isValid} text="Save" />
                                </SaveButton>
                            ) : (
                                <ContinueButton>
                                    <SubmitButton isSubmitting={isSubmitting} disabled={!isValid} text="Continue" />
                                    <SkipText onClick={() => nextStep?.()}>SKIP</SkipText>
                                </ContinueButton>
                            )}
                        </Form>
                    )}
                </Formik>
                {showSync && (
                    <SyncButton>
                        <SubmitButton isSubmitting={isLoading} disabled={isLoading} text="Sync" onClick={() => sync()} />
                    </SyncButton>
                )}
            </Root>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={5000}
                onClose={() => {
                    setErrorMessage('');
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>

            {showFeatureDescription && <FeatureDescriptionDialog description={FeatureDescriptions.sis} onClose={() => setShowFeatureDescription(false)} />}
        </>
    );
};

export default SIS;
