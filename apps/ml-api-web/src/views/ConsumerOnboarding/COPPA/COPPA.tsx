import React from 'react';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import { SubmitButton } from '../../../components/InputFields';
import { CheckboxField } from '../../../components/InputFields/CheckboxField';
import { RadioField } from '../../../components/InputFields/RadioField';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';
import { postRequest } from '../../../utils/api';
import { POST_COPPA_CONSENT } from '../../../utils/endpoints';
import { extractErrors, logError } from '../../../utils/helpers';
import { Description, Root, Title, ContinueButton, LeftContentSection } from './COPPA.style';
import { Props } from './COPPA.type';

type CoppaParentalConsent = {
    boundByPrivacyPolicy: boolean;
    hasLegalAuthorityToInstall?: 'yes' | 'no';
};
type Error = {
    hasLegalAuthorityToInstall?: string;
    boundByPrivacyPolicy?: string;
};

const COPPA = ({ nextStep }: Props) => {
    const { showNotification } = useNotificationToast();
    const onContinue = (values: CoppaParentalConsent, helpers: FormikHelpers<any>) => {
        const payload = {
            ...values,
            hasLegalAuthorityToInstall: values.hasLegalAuthorityToInstall === 'yes',
        };
        postRequest<{}, any>(POST_COPPA_CONSENT, payload)
            .then(() => {
                nextStep?.();
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to save COPPA Parental Consent.',
                });
                logError('POST_COPPA_CONSENT', err);
            })
            .finally(() => helpers.setSubmitting(false));
    };

    return (
        <Root>
            <LeftContentSection>
                <Title>COPPA Parental Consent</Title>
                <Description>
                    Please review the Safe Kids{' '}
                    <a className="primary-text cursor-pointer" href="https://www.safekids.ai/privacy_policy/" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                    </a>{' '}
                    and the{' '}
                    <a className="primary-text cursor-pointer" href="https://www.safekids.ai/termsandconditions/" target="_blank" rel="noopener noreferrer">
                        Terms of Use
                    </a>{' '}
                    before completing this form.
                </Description>
                <Formik
                    enableReinitialize
                    // @ts-ignore
                    onSubmit={onContinue}
                    initialValues={{
                        hasLegalAuthorityToInstall: 'yes',
                        boundByPrivacyPolicy: false,
                    }}
                    validateOnMount
                    validateOnChange
                    validate={(values) => {
                        console.log(values);
                        const errors: FormikErrors<Error> = {};
                        errors.hasLegalAuthorityToInstall = values.hasLegalAuthorityToInstall === 'yes' ? undefined : 'Required';
                        errors.boundByPrivacyPolicy = values.boundByPrivacyPolicy ? undefined : 'Required';

                        return extractErrors(errors);
                    }}>
                    {({ isSubmitting, isValid, errors }) => {
                        return (
                            <Form>
                                <div className="agreement-container">
                                    <span className="agreement-text">
                                        {`If your child is under the age of 13, the Childrens Online Privacy
          Protection Act (COPPA) requires Safe Kids to provide parental
          notification and obtain parental consent before collecting personal
          information from your child or your child’s computer. Since the Safe
          Kids software collects information from monitored computer that may be
          used by your child, we need to have your consent.`}
                                        <br /> <br />
                                        {`Please confirm you have the legal authority to install the Safe Kids’
          Sofware on every monitored device on which you install the Software.`}
                                    </span>
                                    <div>
                                        <RadioField
                                            items={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' },
                                            ]}
                                            name="hasLegalAuthorityToInstall"
                                        />
                                    </div>
                                    <div className="checkbox-container">
                                        <CheckboxField
                                            name="boundByPrivacyPolicy"
                                            label={
                                                <span className="checkbox-label">
                                                    I agree, on behalf of myself and my child, to be bound by the{' '}
                                                    <a
                                                        className="primary-text cursor-pointer"
                                                        href="https://www.safekids.ai/privacy_policy/"
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        Privacy Policy
                                                    </a>{' '}
                                                    and the{' '}
                                                    <a
                                                        className="primary-text cursor-pointer"
                                                        href="https://www.safekids.ai/termsandconditions/"
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        Terms of Use
                                                    </a>
                                                </span>
                                            }
                                        />
                                    </div>
                                    <span className="agreement-text">
                                        <br /> For any questions, please contact <a href="mailto:coppa@safekids.ai">coppa@safekids.ai</a>
                                    </span>
                                </div>
                                <ContinueButton>
                                    <SubmitButton isSubmitting={isSubmitting} text="Next" disabled={!isValid} id={'COPPA-submit-button'} />
                                </ContinueButton>
                            </Form>
                        );
                    }}
                </Formik>
            </LeftContentSection>
        </Root>
    );
};

export default COPPA;
