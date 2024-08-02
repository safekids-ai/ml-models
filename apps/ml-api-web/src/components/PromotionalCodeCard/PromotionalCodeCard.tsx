import React, { useCallback, useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { getRequest, patchRequest } from '../../utils/api';
import { CodeInput, PromotionalCodeCardStyled } from './PromotionalCodeCard.style';
import { SubmitButton } from '../InputFields';
import { UPDATE_USER_PLAN, VERIFY_PROMO_CODE } from '../../utils/endpoints';
import { PromoCodeInfo, Props } from './PromotionalCodeCard.type';
import { generatePromoCodeDescription } from './PromotionalCodeCard.utils';

const initialValues = {
    CODE: '',
};

export const PromotionalCodeCard = ({ setPromoCode, activePlanId }: Props) => {
    const [promoDescription, setPromoDescription] = useState('');
    const onSubmit = useCallback(
        (values, helper: FormikHelpers<any>) => {
            const { setFieldError, setSubmitting } = helper;
            const { CODE: promoCode } = values;
            if (promoCode) {
                getRequest<{}, PromoCodeInfo>(`${VERIFY_PROMO_CODE}/${promoCode}`, {})
                    .then(({ data }) => {
                        if (!data.active) {
                            setFieldError('CODE', 'The code is expired.');
                            setSubmitting(false);
                        } else {
                            if (activePlanId && promoCode) {
                                patchRequest<{}, {}>(`${VERIFY_PROMO_CODE}/${promoCode}/apply`, {})
                                    .then(() => {
                                        setPromoDescription(generatePromoCodeDescription(data));
                                        setPromoCode(promoCode, data);
                                        setSubmitting(false);
                                    })
                                    .catch(() => {
                                        setFieldError('CODE', 'The code is invalid.');
                                        setSubmitting(false);
                                    });
                            } else {
                                setPromoDescription(generatePromoCodeDescription(data));
                                setPromoCode(promoCode, data);
                                setSubmitting(false);
                            }
                        }
                    })
                    .catch(() => {
                        setSubmitting(false);
                        setFieldError('CODE', 'The code is invalid.');
                    });
            }
        },
        [promoDescription, activePlanId]
    );

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={yup.object().shape({
                CODE: yup.string().required('Code is a required field.'),
            })}
            onSubmit={onSubmit}>
            {({ isSubmitting, isValid }) => {
                return (
                    <PromotionalCodeCardStyled isActive={!!promoDescription}>
                        <div className="left-section">
                            <span className="title">PROMOTIONAL CODE</span>
                            <span className="text-code">{promoDescription || 'If you have a promotional code, enter it here:'}</span>
                        </div>
                        {!!promoDescription ? (
                            <span className="thanks-span">Thanks</span>
                        ) : (
                            <div className="code-input">
                                <CodeInput name="CODE" label="CODE" showError showClear disabled={isSubmitting} />
                                <SubmitButton
                                    className={`apply-button ${!isValid ? 'disabled-button' : ''}`}
                                    isSubmitting={isSubmitting}
                                    text="APPLY"
                                    disabled={!isValid}
                                />
                            </div>
                        )}
                    </PromotionalCodeCardStyled>
                );
            }}
        </Formik>
    );
};
