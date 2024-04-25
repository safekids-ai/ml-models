import { Button, MenuItem } from '@material-ui/core';
import { Form, Formik, FieldArray, FormikHelpers } from 'formik';
import * as yup from 'yup';
import React, { useCallback } from 'react';
import { InputField, SelectField, SubmitButton } from '../../../components/InputFields';
import Loader from '../../../components/Loader';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';
import { postRequest, getRequest } from '../../../utils/api';
import { CONSUMER_KID } from '../../../utils/endpoints';
import { logError, getKidDateOfBirthRange } from '../../../utils/helpers';
import { KidInfo } from '../NextSteps/NextSteps';
import { ContinueButton, Description, Root, Title } from './AddKid.style';
import { Props } from './AddKid.type';

type Kid = { firstName: string; lastName: string; yearOfBirth: string };

const AddKid = ({ nextStep, isOnBoarding }: Props) => {
    const [kidsData, setKidsData] = React.useState<any[]>([
        {
            id: null,
            firstName: '',
            lastName: '',
            yearOfBirth: '',
        },
    ]);
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotificationToast();
    const getUserData = useCallback((loading: boolean = true) => {
        setLoading(loading);
        getRequest<{}, KidInfo[]>(CONSUMER_KID, {})
            .then(({ data }) => {
                const apikidsData = data.map((kData: KidInfo) => {
                    return {
                        id: kData.id,
                        firstName: kData.firstName,
                        lastName: kData.lastName,
                        yearOfBirth: kData?.yearOfBirth,
                    };
                });
                setKidsData(apikidsData);
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to get kids',
                });
                logError('CONSUMER_KID', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [showNotification]);
    React.useEffect(() => {
        if (!isOnBoarding) {
            getUserData();
        }
    }, [getUserData, isOnBoarding]);
    const onContinue = (values: { kids: Kid[] }, helpers: FormikHelpers<any>) => {
        postRequest<{}, any>(CONSUMER_KID, values.kids)
            .then(() => {
                nextStep(3);
                if (!isOnBoarding) {
                    getUserData(false);
                    showNotification({
                        type: 'success',
                        message: 'Kid added successfully',
                    });
                }
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to add kid(s).',
                });
                logError('POST_CREATE_KID', err);
            })
            .finally(() => helpers.setSubmitting(false));
    };


    return (
        <Root isOnBoarding={isOnBoarding}>
            {!loading && (
                <>
                    <Title isOnBoarding={isOnBoarding}>Add Kid</Title>
                    <Description></Description>
                    <div className="content">
                        <Formik
                            validateOnMount
                            enableReinitialize
                            initialValues={{
                                kids: kidsData,
                            }}
                            validateOnChange
                            onSubmit={onContinue}
                            validationSchema={yup.object().shape({
                                kids: yup.array().of(
                                    yup.object().shape({
                                        firstName: yup.string().required(),
                                        lastName: yup.string().required(),
                                        yearOfBirth: yup.number().required(),
                                    }),
                                ),
                            })}
                        >
                            {({ values, isValid, isSubmitting, errors }) => (
                                <Form>
                                    <FieldArray name="kids">
                                        {({ push, remove }) => (
                                            <>
                                                <div className="form-container">
                                                    {values.kids.length &&
                                                        values.kids.map((kid, index) => (
                                                            <div key={`create-kid-${index}`} className="kid-component-wrapper">
                                                                <InputField id="kid-firstname-field" name={`kids.${index}.firstName`} label="First Name" />
                                                                <InputField id="kid-lastname-field" name={`kids.${index}.lastName`} label="Last Name" />
                                                                <SelectField
                                                                    inputProps={{ id: 'kid-dob-field' }}
                                                                    className="date-range"
                                                                    name={`kids.${index}.yearOfBirth`}
                                                                    label="Year of Birth"
                                                                >
                                                                    {getKidDateOfBirthRange()?.map((date: any, index: string) => (
                                                                        <MenuItem key={index.toString()} value={date}>
                                                                            {date}
                                                                        </MenuItem>
                                                                    ))}
                                                                </SelectField>
                                                                {values.kids?.length > 1 && (
                                                                    <div id="remove-kid-button" className="remove-span" onClick={() => remove(index)}>
                                                                        Remove
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                                <div className="add-more-container">
                                                    <Button
                                                        id="kid-add-button"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() =>
                                                            push({
                                                                id: null,
                                                                firstName: '',
                                                                lastName: '',
                                                                yearOfBirth: '',
                                                            })
                                                        }
                                                    >
                                                        ADD MORE
                                                    </Button>
                                                    {(() => {
                                                        if(!isOnBoarding){
                                                            return <span>Want to add additional family members? Press add more button</span>
                                                        }
                                                    })()}
                                                </div>
                                            </>
                                        )}
                                    </FieldArray>
                                    <ContinueButton className={`${!isOnBoarding ? (Object.keys(errors).length > 0 ? 'disable-setting' : 'setting-btn') : ''}`}>
                                        <SubmitButton
                                            id="kid-submit-button"
                                            isSubmitting={isSubmitting}
                                            disabled={Object.keys(errors).length > 0 || !isValid}
                                            text={isOnBoarding ? 'Next' : 'Save'}
                                        />
                                    </ContinueButton>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </>
            )}
            {loading && <Loader />}
        </Root>
    );
};

export default AddKid;
