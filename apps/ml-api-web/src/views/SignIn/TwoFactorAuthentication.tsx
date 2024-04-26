import React, { useCallback, useState } from 'react';
import logo from '../../images/getStartedAlt.png';
import FormPage from '../../components/FormPage';
import { SubmitButton, PinField, MessageContainer } from '../../components/InputFields';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { Button, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

type Props = {
    onSubmit: (code: string) => void;
    isSubmitting: boolean;
    message?: string;
    status: 'success' | 'info' | 'warning' | 'error' | undefined;
};
const TwoFactorAuthentication: React.FC<Props> = ({ onSubmit, isSubmitting, message: errorMessage, status: messageStatus }: Props) => {
    const [code, setCode] = useState('');
    const [codeResent, setCodeResent] = useState(false);
    const { resend2FACode } = useAuth();
    const status = !errorMessage ? 'info' : messageStatus;

    const btnDisabled = !code || code.length < 6;
    const resend = useCallback(() => {
        setCodeResent(true);
        resend2FACode();
    }, [setCodeResent, resend2FACode]);
    const onClose = useCallback(() => {
        setCodeResent(false);
    }, [setCodeResent]);
    const onClick = useCallback(() => onSubmit(code), [code, onSubmit]);
    return (
        <>
            <FormPage
                title="Two-Factor Authentication"
                subtitle="A message with a verification code has been sent to your phone number."
                image={logo}
                imageSize="320px"
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
                        <MessageContainer message={errorMessage} status={status} />
                        <SubmitButton text={'Sign In'} disabled={btnDisabled} isSubmitting={isSubmitting} marginTop="0px" onClick={onClick} />
                    </>
                }
                terms={
                    <div className="flex-with-center">
                        {' '}
                        Haven't received code?{' '}
                        <Button color="primary" onClick={resend} className="text-button">
                            <span className="primary-text cursor-pointer">Resend</span>{' '}
                        </Button>
                    </div>
                }
            />
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={codeResent} autoHideDuration={3000} onClose={onClose}>
                <Alert severity="success">Two factor authentication code resent</Alert>
            </Snackbar>
        </>
    );
};

export default TwoFactorAuthentication;
