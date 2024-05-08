export type PromoCodeInfo = {
    id: string;
    active: boolean;
    expiresAt: number;
    redeemBy: number;
    currency: null | string;
    percentOff: null | number;
    amountOff: null | number;
};

export type Props = {
    setPromoCode: (code: string, data?: PromoCodeInfo) => void;
    activePlanId: string;
};
