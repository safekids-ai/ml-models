import React, { useState, useCallback } from 'react';
import { Button } from '@mui/material';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { AmexCardIcon, MasterCardIcon, PaypalIcon, VisaCardIcon } from '../../../../svgs/DashboardIcons';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { InputField, SubmitButton, MessageContainer } from '../../../InputFields';
import { validateFullName, validateEmail, validatePostalCode } from '../../../../utils/validations';
import { extractErrors, isSomething } from '../../../../utils/helpers';
import { useMobile } from '../../../../utils/hooks';
import { any, identity, pathOr } from 'ramda';
import { postRequest, getRequest } from '../../../../utils/api';
import { INIT_PAYMENT_METHOD, SAVE_PAYMENT_METHOD } from '../../../../utils/endpoints';
import { CardNumberField } from './CardNumberField';
import { InputElement } from './InputElement';
import { Props } from '../PaymentFormWrapper.type';
import { CardValues, Values, PaypalValues, State, CardErrors, PayPalErrors } from './PaymentForm.type';
import { PaymentFormStyled } from './PaymentForm.style';

const initialCardValues = {
    cardNumber: '',
    cvc: '',
    expiryDate: '',
    name: '',
    postal_code: '',
};
const initialPaypalValues = { email: '' };

export const PaymentForm = ({ onBack, onCompletePayment, onFormSubmit, selectedPlanId }: Props) => {
    const [errors, setErrors] = useState({
        cardNumber: true,
        cvc: true,
        expiry: true,
    });
    const [state, setState] = useState<State>({
        message: undefined,
        status: 'error',
    });
    const stripe = useStripe();
    const elements = useElements();
    const onSubmit = useCallback(
        (values: Values, formikHelpers: FormikHelpers<Values>) => {
            formikHelpers.setSubmitting(true);
            setState((state) => ({
                ...state,
                message: undefined,
                status: 'error',
            }));
            if (onFormSubmit) {
                onFormSubmit(values, formikHelpers);
            } else {
                const cardElement = elements?.getElement(CardNumberElement);
                if (!stripe || !cardElement) return;
                getRequest<{}, { clientSecret: string }>(INIT_PAYMENT_METHOD, {})
                    .then(({ data }) => {
                        const { clientSecret } = data;
                        if (typeof clientSecret === 'string') {
                            stripe
                                .confirmCardSetup(clientSecret, {
                                    payment_method: {
                                        card: cardElement,
                                        billing_details: {
                                            name: (values as CardValues).name,
                                            address: {
                                                postal_code: (values as CardValues).postal_code,
                                            },
                                        },
                                    },
                                })
                                .then((result) => {
                                    const paymentMethodID = pathOr('', ['setupIntent', 'payment_method'], result);
                                    if (paymentMethodID) {
                                        postRequest<{ paymentMethodID: string }, any>(SAVE_PAYMENT_METHOD, { paymentMethodID })
                                            .then(() => {
                                                onCompletePayment(selectedPlanId).catch(() => {
                                                    formikHelpers.setSubmitting(false);
                                                });
                                            })
                                            .catch(() => {
                                                setState((state) => ({
                                                    ...state,
                                                    message: 'Could not save card',
                                                    status: 'error',
                                                }));
                                            });
                                    } else {
                                        const message = pathOr('Could not save card', ['error', 'message'], result);
                                        formikHelpers.setSubmitting(false);
                                        setState((state) => ({
                                            ...state,
                                            message,
                                            status: 'error',
                                        }));
                                    }
                                })
                                .catch(() => {
                                    formikHelpers.setSubmitting(false);
                                    setState((state) => ({
                                        ...state,
                                        message: 'Could not save card',
                                        status: 'error',
                                    }));
                                });
                        } else {
                            formikHelpers.setSubmitting(false);
                            setState((state) => ({
                                ...state,
                                message: 'Could not save card',
                                status: 'error',
                            }));
                        }
                    })
                    .catch(() => {
                        formikHelpers.setSubmitting(false);
                        setState((state) => ({
                            ...state,
                            message: 'Unable to save load payment method',
                            status: 'error',
                        }));
                    });
            }
        },
        [onCompletePayment, onFormSubmit, elements, stripe]
    );
    return (
        <Formik
            initialValues={{
                method: 'card',
                ...initialCardValues,
            }}
            validateOnMount
            onSubmit={onSubmit}
            validate={(values: Values): void => {
                if (values.method === 'card') {
                    const error: CardErrors = {};
                    const cardValues = values as CardValues;
                    error.name = validateFullName(cardValues.name, 'Full Name');
                    error.cardNumber = errors.cardNumber ? 'Invalid Card Number' : undefined;
                    error.cvc = errors.cvc ? 'Invalid Card CVC' : undefined;
                    error.expiryDate = errors.expiry ? 'Invalid Card Expiry' : undefined;
                    error.postal_code = validatePostalCode(cardValues.postal_code);
                    return extractErrors(error);
                } else {
                    const paypalValues = values as PaypalValues;
                    const error: PayPalErrors = {};
                    error.email = validateEmail(paypalValues.email);
                    return extractErrors(error);
                }
            }}>
            {({ values, setValues, isSubmitting, isValid, validateForm }: FormikProps<Values>) => {
                return (
                    <Form>
                        <PaymentFormStyled>
                            <div className="payment-form">
                                <div className="payment-methods">
                                    <div
                                        className={`payment-method ${values.method === 'card' ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (values.method !== 'card') setValues({ method: 'card', ...initialCardValues });
                                        }}>
                                        Credit Card
                                        <div className="payment-method-icons">
                                            <VisaCardIcon />
                                            <MasterCardIcon />
                                            <AmexCardIcon />
                                        </div>
                                    </div>
                                    <div
                                        className={`payment-method ${values.method === 'paypal' ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (values.method !== 'paypal') setValues({ method: 'paypal', ...initialPaypalValues });
                                        }}>
                                        PayPal
                                        <div className="payment-method-icons" style={{ justifyContent: 'center' }}>
                                            <PaypalIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="fields">
                                    {values.method === 'paypal' && (
                                        <>
                                            <InputField name="email" label="Email" className="field" />
                                        </>
                                    )}
                                    {values.method === 'card' && (
                                        <>
                                            <InputField name="name" label="Name on Card" className="field" />
                                            <CardNumberField
                                                className={`field card-field`}
                                                onChange={({ error, empty }: any) => {
                                                    setErrors((errors) => ({
                                                        ...errors,
                                                        cardNumber: isSomething(error) || empty,
                                                    }));
                                                    validateForm();
                                                }}
                                            />
                                            <div className="card-details">
                                                <InputElement
                                                    name="cvc"
                                                    component={CardCvcElement}
                                                    label="CVC"
                                                    placeholder=""
                                                    onChange={({ error, empty }: any) => {
                                                        setErrors((errors) => ({
                                                            ...errors,
                                                            cvc: isSomething(error) || empty,
                                                        }));
                                                        validateForm();
                                                    }}
                                                />
                                                <InputElement
                                                    name="expiryDate"
                                                    component={CardExpiryElement}
                                                    label="Expiry Date"
                                                    placeholder="MM/YY"
                                                    onChange={({ error, empty }: any) => {
                                                        setErrors((errors) => ({
                                                            ...errors,
                                                            expiry: isSomething(error) || empty,
                                                        }));
                                                        validateForm();
                                                    }}
                                                />
                                            </div>
                                            <InputField className="field" name="postal_code" label="ZIP / Postal Code" />
                                        </>
                                    )}
                                </div>
                                <MessageContainer message={state.message} status={state.status} height={65} />
                                <div className="buttons">
                                    <Button variant="outlined" onClick={onBack} className="cancel-button" disabled={isSubmitting}>
                                        CANCEL
                                    </Button>
                                    <SubmitButton
                                        className={!isValid || any(identity, Object.values(errors)) ? '' : 'submit-button'}
                                        isSubmitting={isSubmitting}
                                        text="ENTER"
                                        marginTop={0}
                                        disabled={!isValid || any(identity, Object.values(errors))}
                                    />
                                </div>
                            </div>
                        </PaymentFormStyled>
                    </Form>
                );
            }}
        </Formik>
    );
};
