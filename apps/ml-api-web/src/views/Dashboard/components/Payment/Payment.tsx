import React, { useCallback, useEffect, useState } from 'react';
import { Title, PaymentStyled, TrialStatusStyled, CardStatusStyled, PlanContainer, HeadingContainerStyled } from './Payment.style';
import { Button } from '@mui/material';
import { PlanSelector } from '../../../ConsumerOnboarding/PlanSelector/PlanSelector';
import { GET_PAYMENT_METHOD, GET_USER_PLAN } from '../../../../utils/endpoints';
import { getRequest } from '../../../../utils/api';
import { format, formatDistanceToNowStrict, isBefore } from 'date-fns';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import PaymentMethodModal from '../../../../components/PaymentMethodModal/PaymentMethodModal';
import { SubmitButton } from '../../../../components/InputFields';
import { CancellationForm } from '../../../../components/CancellationForm/CancellationForm';
import { ActivePlan } from '../../../ConsumerOnboarding/PlanSelector/PlanSelector.type';

const supportText: string = `Any questions? Please feel free to contact us at `;
const supportLink: string = `support@safekids.ai`;

type PaymentMethod = {
    id: string;
    paymentMethodId: string;
    lastDigits: string;
    expiryMonth: number;
    expiryYear: number;
};

const getText = (plan: ActivePlan | null): string => {
    if (plan?.status === 'trialing') {
        const formatedDate = format(new Date(plan.subscriptionEndTime), 'LLLL dd, yyyy');
        const result = formatDistanceToNowStrict(new Date(plan.subscriptionEndTime));
        return plan.cancelAtPeriodEnd
            ? `You have cancelled your subscription and will not be charged anymore. Your subscription will end in ${result} (${formatedDate}). If you'd like to resubscribe, please `
            : `You are currently in a free trial, which will end in ${result} (${formatedDate}). After the free trial, you will be charged ${
                  'Yearly Plan' !== plan?.planName
                      ? `$${plan.upcomingInvoice?.amountRemaining || plan.price} monthly`
                      : `$${plan.upcomingInvoice?.amountRemaining || plan.price} for this year`
              }. `;
    } else if (plan?.status === 'active') {
        const result = formatDistanceToNowStrict(new Date(plan.subscriptionEndTime));
        const formatedDate = format(new Date(plan.subscriptionEndTime), 'LLLL dd, yyyy');
        return plan.cancelAtPeriodEnd
            ? `You have cancelled your subscription and will not be charged anymore. Your subscription will end in ${result} (${formatedDate}). If you'd like to resubscribe, please `
            : `You are currently enrolled in the ${plan?.planName}, which will auto renew in ${result} (${formatedDate}). `;
    }
    return 'Your free trial has ended. You can subscribe to Monthly or Yearly plans. ';
};

export const Payment = ({ onPlanChange }: { onPlanChange?: () => void }) => {
    const { showNotification } = useNotificationToast();
    const [viewPlan, setViewPlan] = React.useState(false);
    const [cancelFormState, setCancelFormState] = useState(false);
    const [isCardExpired, setCardExpired] = React.useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod | null>(null);

    const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
    const [openPaymentMethodModal, setPaymentMethodModal] = useState<boolean>(false);

    const getActiveplan = useCallback(async () => {
        getRequest<{}, ActivePlan>(GET_USER_PLAN, {})
            .then(({ data }) => {
                if (data) {
                    setActivePlan(data);
                }
            })
            .catch(() => {
                showNotification({ type: 'error', message: 'Failed to get Plans' });
            });
    }, [showNotification]);

    const getPaymentMethod = useCallback(async () => {
        getRequest<{}, PaymentMethod>(GET_PAYMENT_METHOD, {})
            .then(({ data }) => {
                if (data) {
                    const isExpired = isBefore(new Date(data.expiryYear, data.expiryMonth, 1), new Date());
                    setCardExpired(isExpired);
                    setActivePaymentMethod(data);
                }
            })
            .catch(() => {
                showNotification({ type: 'error', message: 'Failed to get Payment Method.' });
            });
    }, [showNotification]);

    useEffect(() => {
        getPaymentMethod().then(() => {
            getActiveplan();
        });
    }, [getActiveplan, getPaymentMethod]);


    const onCompletePayment = useCallback(async () => {
        getPaymentMethod().then(() => {
            setPaymentMethodModal(false);
        });
    }, [getPaymentMethod]);

    return (
        <PaymentStyled id="payment">
            <HeadingContainerStyled>
                <TrialStatusStyled>
                    <Title>Payment</Title>
                    <span className="trial-status">
                        {getText(activePlan)}
                        {!viewPlan ? (
                            <span className="view-plan" onClick={() => setViewPlan(true)}>
                                View Plan
                            </span>
                        ) : (
                            <span className="view-plan" onClick={() => setViewPlan(false)}>
                                Close Plan
                            </span>
                        )}
                    </span>
                </TrialStatusStyled>
                {!viewPlan && (
                    <>
                        {cancelFormState && (
                            <CancellationForm
                                onClose={() => {
                                    getPaymentMethod().then(() => {
                                        getActiveplan();
                                    });
                                    setCancelFormState(false);
                                }}
                            />
                        )}
                        {activePlan && !activePlan?.cancelAtPeriodEnd && (
                            <Button
                                variant="outlined"
                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                    e.preventDefault();
                                    setCancelFormState(true);
                                }}
                                className="cancel-service">
                                CANCEL SERVICE
                            </Button>
                        )}
                        <SubmitButton
                            className="change"
                            marginTop={0}
                            text={!!activePaymentMethod ? 'CHANGE' : 'ADD'}
                            disabled={viewPlan}
                            marginBottom={20}
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                e.preventDefault();
                                setPaymentMethodModal(true);
                            }}
                            id="test-Add-btn"
                            data-testid="test-Add-btn"
                        />
                    </>
                )}
            </HeadingContainerStyled>
            {!viewPlan ? (
                !isCardExpired ? (
                    <CardStatusStyled>
                        <span className="card-status">
                            {`${
                                !!activePaymentMethod
                                    ? 'The card you provided is currently being charged.'
                                    : `Currently, you don't have any payment method. Please add a payment method.`
                            }`}
                        </span>
                        {!!activePaymentMethod && (
                            <span className="card-credentials">{`**** **** **** ${activePaymentMethod?.lastDigits} - Ex Date ${activePaymentMethod?.expiryMonth}/${activePaymentMethod?.expiryYear}`}</span>
                        )}
                    </CardStatusStyled>
                ) : (
                    <CardStatusStyled colorRed>
                        <span className="card-status">
                            The card you provided is expired. Please use the CHANGE button to add a new card. Your service will expire in 24 hours.
                        </span>
                        <span className="card-credentials">{`**** **** **** ${activePaymentMethod?.lastDigits} - Ex Date ${activePaymentMethod?.expiryMonth}/${activePaymentMethod?.expiryYear} - EXPIRED`}</span>
                    </CardStatusStyled>
                )
            ) : (
                <PlanContainer>
                    <PlanSelector
                        onRefresh={() => {
                            getPaymentMethod().then(() => {
                                getActiveplan().then(() => {
                                    if (onPlanChange) onPlanChange();
                                });
                            });
                        }}
                    />
                </PlanContainer>
            )}
            <span className="text">
                {`${supportText}`}
                <a className="support-link" href="mailto:support@safekids.ai">{`${supportLink}`}</a>
            </span>
            {openPaymentMethodModal && (
                <PaymentMethodModal
                    onClose={() => {
                        setPaymentMethodModal(false);
                    }}
                    onPaymentComplete={onCompletePayment}
                />
            )}
        </PaymentStyled>
    );
};
