import React, { useState, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/getStartedAlt.png';
import { MessageContainer } from '../../components/InputFields';
import { validatePassword } from '../../utils/validations';
import { extractErrors, getErrorMessage } from '../../utils/helpers';
import FormPage from '../../components/FormPage';
import { postRequest } from '../../utils/api';
import { UPDATE_FORGOT_PASSWORD } from '../../utils/endpoints';
import { RequestType } from '../../utils/error-messages';
import { PasswordInputContainer, SubmitBtnContainer } from './CreatePassword.style';

const initialValues = {
    password: '',
};
type Values = {
    password: string;
};
type CreatePasswordRequest = Values & { email: string };
type Errors = Partial<Values>;
type Props = {
    email: string;
};

type State = {
    message?: string;
    status?: 'error' | 'success';
};
const CreatePassword: React.FC<Props> = ({ email }: Props) => {
    const [state, setState] = useState<State>({});
    // const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();
    const onSubmit = useCallback(
        async (values: Values) => {
            try {
                const { status } = await postRequest<CreatePasswordRequest>(UPDATE_FORGOT_PASSWORD, { email, ...values });
                if (status === 201) {
                    setState((state) => ({
                        ...state,
                        message: 'Password updated successfully',
                        status: 'success',
                    }));
                    setTimeout(() => navigate('/signin'), 2000);
                } else {
                    setState((state) => ({
                        ...state,
                        message: 'Password could not be updated',
                        status: 'error',
                    }));
                }
            } catch (ex) {
                const message = getErrorMessage(RequestType.CreateNewPassword, ex, 'Password could not be updated');
                setState((state) => ({
                    ...state,
                    message,
                    status: 'error',
                }));
            }
        },
        [email, navigate],
    );
    return (
        <FormPage
            title="Create New Password"
            subtitle="Choose minimum 8 character password"
            image={logo}
            imageSize="320px"
            onBack={() => navigate('/signin')}
            content={
                <Formik
                    onSubmit={onSubmit}
                    validateOnMount
                    validate={(values) => {
                        const errors: Errors = {};
                        errors.password = validatePassword(values.password);

                        return extractErrors(errors);
                    }}
                    initialValues={initialValues}
                >
                    {({ isSubmitting, isValid }) => {
                        return (
                            <Form>
                                <PasswordInputContainer name="password" label="Password" showStrengthBar showCriteria />

                                <MessageContainer message={state.message} status={state.status} />
                                <SubmitBtnContainer disabled={!isValid} isSubmitting={isSubmitting} marginTop={0} />
                            </Form>
                        );
                    }}
                </Formik>
            }
            terms={null}
        />
    );
};

export default CreatePassword;
