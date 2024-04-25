import React, { useState, useCallback } from 'react';
import { PinField, SubmitButton, MessageContainer } from '../../components/InputFields';
import FormPage from '../../components/FormPage';
import logo from '../../images/getStartedAlt.png';

type Props = {
    onSubmit: (code: string) => void;
    isSubmitting: boolean;
    message?: string;
    status: 'success' | 'info' | 'warning' | 'error' | undefined;
    onResend: () => void;
};
const VerifyEmail: React.FC<Props> = ({ onSubmit, isSubmitting, message: errorMessage, status: messageStatus, onResend }: Props) => {
    const [code, setCode] = useState('');
    const [messageDisplayed, setMessageDisplayed] = useState(false);
    const btnDisabled = !code || code.length < 6;
    const message = errorMessage || (!messageDisplayed ? 'Please enter verification code sent to your email' : undefined);
    const status = !errorMessage ? 'info' : messageStatus;
    if (errorMessage && !messageDisplayed) {
        setMessageDisplayed(true);
    }
    const onClick = useCallback(() => onSubmit(code), [code, onSubmit]);
    return (
        <FormPage
            title="Email Verification"
            subtitle="A message with a verification code has been sent to your email."
            image={logo}
            wrapperStyle={{ marginTop: '36px' }}
            content={
                <>
                    <PinField
                        length={6}
                        onChange={setCode}
                        onComplete={(code: string) => {
                            onSubmit(code);
                        }}
                    />
                    <MessageContainer message={message} status={status} />
                    <SubmitButton text="Verify" disabled={btnDisabled} isSubmitting={isSubmitting} marginTop="0px" onClick={onClick} />
                </>
            }
            terms={
                <>
                    {' '}
                    Haven't received code?{' '}
                    <span className="primary-text cursor-pointer" onClick={onResend}>
                        Resend
                    </span>{' '}
                </>
            }
        />
    );
};
export default VerifyEmail;
