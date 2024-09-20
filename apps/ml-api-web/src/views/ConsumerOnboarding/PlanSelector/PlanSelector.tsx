import React, {useCallback, useEffect, useState} from 'react';
import {PlanCard} from '../../../components/PlanCard/PlanCard';
import {SubmitButton} from '../../../components/InputFields';
import Loader from '../../../components/Loader/Loader';
import {PaymentMethodCard} from '../../../components/PaymentMethodCard/PaymentMethodCard';
import PaymentMethodModal from '../../../components/PaymentMethodModal/PaymentMethodModal';
import {useNotificationToast} from '../../../context/NotificationToastContext/NotificationToastContext';
import {getRequest, postRequest, putRequest} from '../../../utils/api';
import {
  GET_PAYMENT_METHOD,
  GET_PLANS,
  GET_USER_PLAN,
  UPDATE_USER_PLAN,
  VERIFY_PROMO_CODE
} from '../../../utils/endpoints';
import {ContinueButton} from '../COPPA/COPPA.style';

import {Root, Title} from './PlanSelector.style';
import {round} from 'lodash';
import {PromotionalCodeCard} from '../../../components/PromotionalCodeCard/PromotionalCodeCard';
import {Invoice, PaymentMethod, Plan, ActivePlan} from './PlanSelector.type';
import {PromoCodeInfo} from '../../../components/PromotionalCodeCard/PromotionalCodeCard.type';
import {getPlanPrice, getAfterDiscountPrice, getPlanName} from './PlanSelector.utils';

type Props = {
  nextStep?: () => void;
  onRefresh?: () => void;
  isOnBoarding?: boolean;
};

type PlanProps = {
  price: number;
  type: string;
};

const PlanContent = ({price, type}: PlanProps): JSX.Element => {
  if (type === 'FREE') {
    return <span>Our software is free and fully functional. But please be a supporter for us to continue our mission. </span>;
    // return <span>This plan is for Free and has limited features. </span>;
  }
  if (type === 'MONTHLY') {
    return <>
      <span>Thanks for your monthly support. We will continue to build state of art features. </span>
      <br/>
      <span>This plan asks for a monthly payment. </span>
      <br/>
      <span>Each month we'll notify you of your monthly payment for a total of ${price}.</span>
    </>
    // return <span>This plan asks for a monthly payment. Each month we'll notify you of your monthly payment for a total of ${price}.</span>;
  }
  if (type === 'YEARLY') {
    return (
      <>
        <span>Thanks for your annual support. Your help will go a long way in our software updates. </span>
        <br/>
        <span>This plan asks for a single payment for the year.</span>
        {/*<span>This plan asks for a single payment for the year and provides a ~25% discount.</span>*/}
        <br/>
        <span>Your total is ${price} for the year.</span>{' '}
      </>
    );
  }
  return <span>This plan does not ask for any payment. Each month we'll notify you of your monthly payment for a total of ${price}.</span>;
};

export const PlanSelector = ({nextStep, isOnBoarding = false, onRefresh}: Props): JSX.Element => {
  const {showNotification} = useNotificationToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');

  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod | null>(null);

  const [activePlanId, setActivePlanId] = useState<string>('');
  const [activePromoCodeInfo, setActivePromoCodeInfo] = useState<PromoCodeInfo | null>(null);
  const [nextInvoice, setNextInvoice] = useState<Invoice | null>(null);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [openPaymentMethodModal, setPaymentMethodModal] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getRequest<{}, any[]>(GET_PLANS, {})
      .then(({data}) => {
        setPlans(data);
        getActiveplan().then(() => {
          getPaymentMethod().then(() => {
            setLoading(false);
          });
        });
      })
      .catch(() => {
        setLoading(false);
        showNotification({type: 'error', message: 'Failed to get Plans'});
      });
  }, []);

  const onCompletePayment = useCallback(
    async (selectedPlan) => {
      getPaymentMethod().then(() => {
        if (selectedPlan) {
          !activePlanId
            ? postRequest<{}, {}>(`${UPDATE_USER_PLAN}/${selectedPlan}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
              .then(() => {
                setActivePlanId(selectedPlan);
                setSelectedPlanId('');
                setPaymentMethodModal(false);
              })
              .catch(() => {
                showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
              })
            : putRequest<{}, {}>(`${UPDATE_USER_PLAN}/${selectedPlan}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
              .then(async () => {
                // wait for fetch updated plan
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setActivePlanId(selectedPlan);
                setSelectedPlanId('');
                onRefresh?.();
                setPaymentMethodModal(false);
              })
              .catch(() => {
                showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
              });
          updateActivePlan(selectedPlan, activePlanId).then(() => {
          });
        } else {
          setPaymentMethodModal(false);
          onRefresh?.();
        }
      });
    },
    [selectedPlanId, promoCode]
  );

  const getActiveplan = useCallback(async () => {
    getRequest<{}, ActivePlan>(GET_USER_PLAN, {})
      .then((res) => {
        if (res.data?.promotionCode) {
          getRequest<{}, PromoCodeInfo>(`${VERIFY_PROMO_CODE}/${res.data.promotionCode}`, {}).then(({data}) => {
            setActivePromoCodeInfo(data);
            setActivePlanId(res.data.planId);
            setNextInvoice(res.data.upcomingInvoice);
          });
        } else {
          setActivePlanId(res.data.planId);
          setNextInvoice(res.data.upcomingInvoice);
        }
      })
      .catch(() => {
        showNotification({type: 'error', message: 'Failed to get Plans'});
      });
  }, []);

  const getPaymentMethod = useCallback(async () => {
    getRequest<{}, PaymentMethod>(GET_PAYMENT_METHOD, {})
      .then(({data}) => {
        if (data) {
          setActivePaymentMethod(data);
        }
      })
      .catch(() => {
        showNotification({type: 'error', message: 'Failed to get payment method.'});
      });
  }, []);

  const updateActivePlan = useCallback(
    async (plan: Plan, activePlanId: string) => {
      setSelectedPlanId(plan.id);
      !activePlanId
        ? postRequest<{}, any[]>(`${UPDATE_USER_PLAN}/${plan.id}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
          .then(() => {
            setActivePlanId(plan.id);
            setSelectedPlanId('');
            onRefresh?.();
          })
          .catch(() => {
            showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
          })
        : putRequest<{}, any[]>(`${UPDATE_USER_PLAN}/${plan.id}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
          .then(async () => {
            // wait for fetch updated plan
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setActivePlanId(plan.id);
            setSelectedPlanId('');

            onRefresh?.();
          })
          .catch(() => {
            showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
          });
      // if (!activePaymentMethod && plan.planType !== 'FREE') {
      //   setSelectedPlanId(plan.id);
      //   setPaymentMethodModal(true);
      // } else {
      //   !activePlanId
      //     ? postRequest<{}, any[]>(`${UPDATE_USER_PLAN}/${plan.id}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
      //       .then(() => {
      //         setActivePlanId(plan.id);
      //         setSelectedPlanId('');
      //         onRefresh?.();
      //       })
      //       .catch(() => {
      //         showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
      //       })
      //     : putRequest<{}, any[]>(`${UPDATE_USER_PLAN}/${plan.id}${promoCode ? `?promotioncode=${promoCode}` : ''}`, {})
      //       .then(async () => {
      //         // wait for fetch updated plan
      //         await new Promise((resolve) => setTimeout(resolve, 2000));
      //         setActivePlanId(plan.id);
      //         setSelectedPlanId('');
      //
      //         onRefresh?.();
      //       })
      //       .catch(() => {
      //         showNotification({type: 'error', message: 'Failed to apply the selected plan.'});
      //       });
      // }
    },
    [activePaymentMethod, activePlanId, selectedPlanId, promoCode]
  );

  return loading ? (
    <Loader/>
  ) : (
    <Root $isOnBoarding>
      <Title $isOnBoarding={isOnBoarding}>Plan</Title>
      <p>Our software is completely free. But please support us financially so we can continue to add state-of-art
        features.</p>
      {/*<p>Your first 7 days are free, but in order to continue, you must choose a plan and provide your credit card*/}
      {/*  number.</p>*/}
      {isOnBoarding && (
        <div className="card-container">
          <PromotionalCodeCard
            setPromoCode={(code, data) => {
              setPromoCode(code);
              if (data) {
                setActivePromoCodeInfo(data);
              }
            }}
            activePlanId={activePlanId}
          />
        </div>
      )}
      <div className="plan-container">
        {plans.map((plan: Plan) => {
          const afterDiscountPrice = getAfterDiscountPrice(plan.price, activePromoCodeInfo);
          return (
            <PlanCard
              key={plan.id}
              $isActive={(!isOnBoarding && !activePlanId && plan.planType === 'FREE') || plan.id === activePlanId}
              $price={getPlanPrice(plan.price, plan.planType)}
              $afterDiscountPrice={getPlanPrice(afterDiscountPrice, plan.planType)}
              $planName={getPlanName(activePromoCodeInfo, plan.planType)}
              $isInProgress={selectedPlanId === plan.id}
              onClick={() => {
                updateActivePlan(plan, activePlanId);
              }}>
              {plan.planType === 'YEARLY' ? (
                <PlanContent price={afterDiscountPrice || plan.price} type={plan.planType}/>
              ) : (
                <PlanContent price={round((afterDiscountPrice || plan.price), 2)} type={plan.planType}/>
              )}
            </PlanCard>
          );
        })}
      </div>
      {activePlanId && activePaymentMethod && (
        <div className="card-container">
          <PaymentMethodCard
            nextInvoiceDate={''}
            lastDigits={activePaymentMethod.lastDigits}
            expiryMonth={activePaymentMethod.expiryMonth}
            expiryYear={activePaymentMethod.expiryYear}
            onChange={() => {
              setPaymentMethodModal(true);
            }}
          />
        </div>
      )}
      {openPaymentMethodModal && (
        <PaymentMethodModal
          onClose={() => {
            setPaymentMethodModal(false);
            setSelectedPlanId('');
          }}
          selectedPlanId={selectedPlanId}
          onPaymentComplete={onCompletePayment}
        />
      )}
      {isOnBoarding && (
        <ContinueButton>
          <SubmitButton
            text="Next"
            disabled={!activePlanId}
            id={'COPPA-submit-button'}
            onClick={() => {
              nextStep?.();
            }}
          />
        </ContinueButton>
      )}
    </Root>
  );
};
