import React, { ReactNode } from 'react';
import { PlanCardStyled } from './PlanCard.style';
import { Button } from '@mui/material';
import Loader from '../Loader';

type Props = {
    $afterDiscountPrice?: number;
    $isActive: boolean;
    children: ReactNode;
    $price?: number;
    $priceTenure?: string;
    $planName?: string;
    $actionText?: string;
    $isInProgress?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

export const PlanCard = (props: Props) => {
    const { $isActive, $price, $priceTenure = 'month', $planName, children, $actionText = 'CHOOSE', onClick, $isInProgress = false, $afterDiscountPrice = 0 } = props;

    return (
        <PlanCardStyled $active={$isActive} $hasDiscount={!!$afterDiscountPrice}>
            <div className="top-container">
                <span className="price-text">{`$${$price}`}</span>
                {!!$afterDiscountPrice && <span className="discounted-price-text">{`$${$afterDiscountPrice}`}</span>}
                <span className="plan-tenure">{`per ${$priceTenure}`}</span>
            </div>
            <span className="plan-name-heading">{$planName}</span>
            <div className="plan-content">{children}</div>
            {$isActive ? (
                <span className="thanks-span">Thank you</span>
            ) : (
                <Button className="apply-button" type="submit" onClick={onClick}>
                    {$isInProgress ? <Loader /> : $actionText}
                </Button>
            )}
        </PlanCardStyled>
    );
};
