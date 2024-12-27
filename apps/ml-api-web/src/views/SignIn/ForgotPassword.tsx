import React, { useCallback, useState } from 'react';
import { Formik, Form, FormikErrors, FormikHelpers } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/getStartedAlt.png';
import { PinField, MessageContainer } from '../../components/InputFields';
import { validateEmail } from '../../utils/validations';
import { extractErrors } from '../../utils/helpers';
import FormPage from '../../components/FormPage';
import { postRequest } from '../../utils/api';
import { FORGOT_PASSWORD, VERIFY_PASSWORD_RESET_CODE } from '../../utils/endpoints';
import CreatePassword from './CreatePassword';
import { pathOr, propOr } from 'ramda';
import { ForgotPasswordResponse, VerifyForgotPasswordCodeResponse } from '../../context/AuthContext/types';
import { Button } from '@mui/material';
import { InputContainer, SubmitBtnContainer } from './ForgetPassword.style';
import { LinkSpan } from './Signin.style';
import * as yup from 'yup';

type Values = {
    email: string;
};
type VerifyState = {
    isSubmitting: boolean;
    message?: string;
    status?: 'error' | 'success';
};
type VerifyResetPasswordCodeRequest = Values & {
    code: string;
};

type Props = {
    onSuccess: () => void;
    email: string;
};

const VerifyResetPasswordCode: React.FC<Props> = ({ onSuccess, email }: Props) => {
    const [state, setState] = useState<VerifyState>({ isSubmitting: false });
    const [code, setCode] = useState('');

    const btnDisabled = !code || code.length < 6;

    const onSubmit = useCallback(
        async (code: string) => {
            setState((state) => ({
                ...state,
                isSubmitting: true,
                message: undefined,
            }));
            try {
                const { status, data } = await postRequest<VerifyResetPasswordCodeRequest, VerifyForgotPasswordCodeResponse>(VERIFY_PASSWORD_RESET_CODE, {
                    code,
                    email,
                });
                if (status === 201) {
                    setState((state) => ({
                        ...state,
                        isSubmitting: false,
                        message: 'Code verification successful',
                        status: 'success',
                    }));
                    onSuccess();
                }
            } catch (ex) {
                setState((state) => ({
                    ...state,
                    isSubmitting: false,
                    status: 'error',
                    message: 'Invalid code',
                }));
            }
        },
        [setState, onSuccess, email],
    );
    const onClick = useCallback(() => onSubmit(code), [code, onSubmit]);
    return (
        <>
            <PinField length={6} onComplete={onSubmit} onChange={setCode} />

            <MessageContainer message={state.message} status={state.status} />
            <SubmitBtnContainer disabled={btnDisabled} isSubmitting={state.isSubmitting} marginTop={0} onClick={onClick} />
        </>
    );
};
type State = {
    resetCodeSent?: boolean;
    isCodeVerified?: boolean;
    emailEntered?: string;
    message?: string;
    status?: 'error' | 'success';
};
const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const { state: passedState } = useLocation();
    const [state, setState] = useState<State>({});
    const history = useNavigate();
    const onSubmit = useCallback(
        (formValues: Values, helpers?: FormikHelpers<Values>) => {
            const values = { ...formValues, email: formValues.email.toLowerCase() };
            setState((state) => ({ ...state, message: undefined }));
            postRequest<Values, ForgotPasswordResponse>(FORGOT_PASSWORD, values)
                .then(({ status }) => {
                    const resetCodeSent = status === 201;
                    if (resetCodeSent) {
                        setState((state) => ({
                            ...state,
                            resetCodeSent,
                            emailEntered: values.email,
                        }));
                    }
                })
                .catch((ex) => {
                    const responseStatus = pathOr<number>(0, ['response', 'status'], ex);
                    const message = responseStatus === 600 ? 'Invalid email' : pathOr('Invalid email', ['response', 'data'], ex);

                    setState((state) => ({
                        ...state,
                        resetCodeSent: false,
                        message,
                        status: 'error',
                    }));
                })
                .finally(() => {
                    helpers?.setSubmitting(false);
                });
        },
        [setState],
    );
    const onCodeSuccess = useCallback(() => setState((state) => ({ ...state, isCodeVerified: true })), [setState]);
    const onResendEmail = useCallback(() => {
        if (state.emailEntered) onSubmit({ email: state.emailEntered });
    }, [onSubmit, state]);
    return state.isCodeVerified ? (
        <CreatePassword email={state.emailEntered || ''} />
    ) : (
        <FormPage
            title="Forgot Password"
            subtitle="Let's get you back on track"
            image={logo}
            imageSize="320px"
            onBack={() => navigate('/signin')}
            content={
                state.resetCodeSent ? (
                    <VerifyResetPasswordCode email={state.emailEntered || ''} onSuccess={onCodeSuccess} />
                ) : (
                    <Formik
                        onSubmit={onSubmit}
                        validateOnMount
                        validationSchema={yup.object().shape({
                            email: yup.string().email().required(),
                        })}
                        initialValues={{ email: propOr('', 'email', passedState) }}
                    >
                        {({ isSubmitting, isValid }) => {
                            return (
                                <Form>
                                    <InputContainer name="email" label="Email" />
                                    <MessageContainer message={state.message} status={state.status || 'error'} />
                                    <SubmitBtnContainer disabled={!isValid} isSubmitting={isSubmitting} marginTop={0} />
                                </Form>
                            );
                        }}
                    </Formik>
                )
            }
            terms={
                state.resetCodeSent && (
                    <div className="flex-with-center">
                        {' '}
                        Haven't received email?{' '}
                        <Button color="primary" onClick={onResendEmail} className="text-button">
                            <LinkSpan className="primary-text cursor-pointer">Resend</LinkSpan>{' '}
                        </Button>
                    </div>
                )
            }
        />
    );
};

export default ForgotPassword;
