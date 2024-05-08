import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputField, SubmitButton } from '../../../components/InputFields';
import { getRequest, patchRequest } from '../../../utils/api';
import { GET_EMERGENCY_CONTACT, PATCH_EMERGENCY_CONTACT } from '../../../utils/endpoints';
import { extractErrors, logError } from '../../../utils/helpers';
import { DataType, Props } from './CrisisManagement.type';
import { Formik, FormikErrors, FormikHelpers, Form } from 'formik';
import { validatePhoneNumber } from '../../../utils/validations';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
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
    max-width: 940px;
    line-height: 18px;
    color: #000000;
`;

const ContinueButton = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 250px 20px 30px 0px;
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

const EmergencyContactContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 20px 0 30px 0px;
    & .MuiTextField-root {
        width: 250px;
        margin-right: 20px;
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

const CrisisManagement = ({ nextStep, isSettings }: Props) => {
    const [initialData, setInitialData] = useState<DataType>();
    const { showNotification } = useNotificationToast();

    useEffect(() => {
        getRequest<{}, DataType>(GET_EMERGENCY_CONTACT, {})
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                logError('GET EMERTGENCY CONTACT', err);
            });
    }, []);

    const onContinue = (values: DataType, helpers: FormikHelpers<DataType>) => {
        patchRequest<{}, DataType>(PATCH_EMERGENCY_CONTACT, {
            emergencyContactName: values.emergencyContactName,
            emergencyContactPhone: values.emergencyContactPhone,
        })
            .then(() => {
                if (isSettings) {
                    showNotification({ type: 'success', message: 'Emergency Contact updated successfully.' });
                }
                nextStep?.();
            })
            .catch((err) => {
                showNotification({ type: 'error', message: 'Failed to update Emergency Contact.' });
                logError('PATCH EMERGENCY CONTACT', err);
            })
            .finally(() => helpers.setSubmitting(false));
    };

    return (
        <Root>
            <Title isSettings={isSettings}>Crisis Engagement Leader</Title>
            <Description>The following person will be contacted and instructed on their responsibilities for Crisis Engagement.</Description>

            <Formik
                enableReinitialize
                onSubmit={onContinue}
                initialValues={{
                    emergencyContactName: initialData?.emergencyContactName || '',
                    emergencyContactPhone: initialData?.emergencyContactPhone || '',
                }}
                validateOnMount
                validateOnChange
                validate={(values) => {
                    const errors: FormikErrors<any> = {};
                    errors.emergencyContactName = !values.emergencyContactName ? 'Please enter emergency contact name' : undefined;
                    errors.emergencyContactPhone = !values.emergencyContactPhone
                        ? 'Please enter emergency contact phone'
                        : validatePhoneNumber(values.emergencyContactPhone || '', 'Phone number');
                    return extractErrors(errors);
                }}
            >
                {({ isSubmitting, isValid }) => {
                    return (
                        <Form>
                            <EmergencyContactContainer>
                                <InputField name="emergencyContactName" label="Emergency Contact name" />
                                <InputField name="emergencyContactPhone" label="Emergency Contact Phone" />
                            </EmergencyContactContainer>
                            <span>This person will get a text from our system alerting them to this new responsibility.</span>
                            {isSettings ? (
                                <SaveButton>
                                    <SubmitButton isSubmitting={isSubmitting} disabled={!isValid} text="Save" />
                                </SaveButton>
                            ) : (
                                <ContinueButton>
                                    <SubmitButton isSubmitting={isSubmitting} disabled={!isValid} text="Continue" />
                                </ContinueButton>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </Root>
    );
};

export default CrisisManagement;
