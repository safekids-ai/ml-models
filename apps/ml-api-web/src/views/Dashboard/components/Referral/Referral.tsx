import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import { ReferralStyled, Title } from './Referral.style';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import { GET_PROMO_CODE } from '../../../../utils/endpoints';
import { getRequest } from '../../../../utils/api';
import { ReferralType } from './Referral.type';
import { LoadingContainer } from '../Websites/website.style';
import Loader from '../../../../components/Loader';

export const Referral = () => {
    const { showNotification } = useNotificationToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [noOfRedemtions, setNoOfRedemtions] = useState<number>(0);
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        getRequest<{}, ReferralType>(GET_PROMO_CODE, {})
            .then(({ data }) => {
                setNoOfRedemtions(data?.timesRedeemed);
                setCode(data?.code);
            })
            .catch(() => {
                showNotification({ type: 'error', message: 'Failed to get promo code!' });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [showNotification]);

    const copyReferralUrl = () => {
        navigator.clipboard.writeText(code);
    };

    return loading ? (
        <LoadingContainer>
            <Loader />
        </LoadingContainer>
    ) : (
        <ReferralStyled>
            <Title>Referral Program</Title>

            <div className="container">
                <div className="content">
                    <span>Every time you send a Referral code, you can achieve the next level of rewards:</span>
                    <span>
                        {noOfRedemtions > 0 ? (
                            <>
                                <span className="redemptions-count">{noOfRedemtions}</span> redemptions
                            </>
                        ) : (
                            <span className="redemptions-count">Try our referral program!</span>
                        )}
                    </span>
                </div>
                <input id="promo-code-input" className="promo-code" value={code} name="add-websites-input" disabled />
                <Button id="promo-code-btn" className="copy-button" onClick={copyReferralUrl}>
                    COPY
                </Button>
            </div>
            <span className="description">
                Refer someone you know! Each person who signs up using your referral code will get 10% off their subscription, and you will receive a gift from
                us as a thank you! Refer 5 people and you will get Safe Kids for a year on us!
            </span>
        </ReferralStyled>
    );
};
