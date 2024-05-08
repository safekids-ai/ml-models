import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import logo from '../../images/getStartedAlt.png';
import { MessageContainer } from '../../components/InputFields';
import { validateName, validatePassword } from '../../utils/validations';
import { extractErrors, isSomething, getFormattedName } from '../../utils/helpers';
import FormPage from '../../components/FormPage';
import { useAuth } from '../../context/AuthContext/AuthContext';
import VerifyEmail from './VerifyEmail';
import { Button } from '@mui/material';
import { postRequest, history } from '../../utils/api';
import { RESEND_SIGNUP_CODE } from '../../utils/endpoints';
import { MixPanel } from '../../MixPanel';
import * as yup from 'yup';
import { InputContainer, LinkSpan, PasswordInputContainer, SubmitBtnContainer } from './Signup.style';

export type SignupFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type Errors = Partial<SignupFormValues>;
type State = {
    step: number;
    isSubmitting: boolean;
    message?: string;
    planID?: string;
    code?: string;
};
const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
};
const Signup: React.FC = () => {
    const { signup, verifySignup, data: { signup: signupData = {} } = {}, clearSignup } = useAuth();

    const [state, setState] = useState<State>({
        step: 0,
        isSubmitting: false,
        message: undefined,
    });

    const { registerToken: registrationToken, email = '', message, success: signupSuccess } = signupData || {};

    useEffect(
        function onRegistrationTokenChange() {
            if (registrationToken) setState((state) => ({ ...state, step: 1 }));
        },
        [registrationToken],
    );

    useEffect(function onMount() {
        return () => clearSignup();
        // eslint-disable-next-line
    }, []);
    useEffect(
        function onSignupSuccess() {
            if (isSomething(signupSuccess)) {
                setState((state) => ({ ...state, isSubmitting: false }));
            }
        },
        [signupSuccess],
    );

    const onSubmit = useCallback(
        (valuesObj: SignupFormValues, fProps: FormikHelpers<SignupFormValues>) => {
            const values = {
                ...valuesObj,
                firstName: getFormattedName(valuesObj.firstName),
                lastName: getFormattedName(valuesObj.lastName),
            };
            setState((state) => ({ ...state, message: undefined }));
            signup({ ...values, email: values.email.toLowerCase() }, (message) => {
                setState((state) => ({ ...state, message }));
                if (message) fProps.setSubmitting(false);
                MixPanel.track('SignUp', { email: values.email.toLowerCase() });
                localStorage.setItem('skipped', 'false');
            });
        },
        [setState, signup],
    );
    const onCodeSubmit = useCallback(
        (code: string) => {
            setState((state) => ({ ...state, isSubmitting: true }));
            verifySignup(code, () => {
                history.push('/signin');
            });
        },
        [verifySignup, setState],
    );
    const onResend = useCallback(() => {
        postRequest<{ email: string }, {}>(RESEND_SIGNUP_CODE, { email }, { headers: { Authorization: `Bearer ${registrationToken}` } });
    }, [email, registrationToken]);

    return (
        <>
            {state.step === 0 && (
                <FormPage
                    image={logo}
                    title="Create an Account"
                    subtitle={
                        <div className="flex-with-center flex-wrap">
                            Already have an account?{' '}
                            <Link to="/signin">
                                <Button color="primary" className="text-button">
                                    <LinkSpan className="primary-text cursor-pointer">Sign In</LinkSpan>
                                </Button>
                            </Link>
                        </div>
                    }
                    content={
                        <Formik
                            validateOnMount
                            onSubmit={onSubmit}
                            validate={(values) => {
                                const errors: Errors = {};
                                errors.firstName = validateName(values.firstName, 'First Name');
                                errors.lastName = validateName(values.lastName, 'Last Name');
                                errors.password = validatePassword(values.password);
                                return extractErrors(errors);
                            }}
                            validationSchema={yup.object().shape({
                                firstName: yup.string().required(),
                                lastName: yup.string().required(),
                                email: yup.string().email().required(),
                                password: yup.string().required(),
                            })}
                            initialValues={initialValues}
                        >
                            {({ isSubmitting, isValid }) => {
                                return (
                                    <Form>
                                        <InputContainer name="firstName" label="First Name" />
                                        <InputContainer name="lastName" label="Last Name" />
                                        <InputContainer name="email" label="Email" />
                                        <PasswordInputContainer name="password" label="Password" showStrengthBar showCriteria />
                                        <MessageContainer message={state.message} status="error" />
                                        <SubmitBtnContainer isSubmitting={isSubmitting} text="Sign Up" marginTop={0} disabled={!isValid} />
                                    </Form>
                                );
                            }}
                        </Formik>
                    }
                    terms={<></>}
                />
            )}
            {state.step === 1 && <VerifyEmail isSubmitting={state.isSubmitting} onSubmit={onCodeSubmit} message={message} status="error" onResend={onResend} />}
        </>
    );
};
export default Signup;
