import { round } from 'lodash';
import { PromoCodeInfo } from '../../../components/PromotionalCodeCard/PromotionalCodeCard.type';

export const getDiscountInfoText = (promoInfo: PromoCodeInfo | null): string => {
    if (promoInfo && promoInfo.percentOff) {
        return `(${promoInfo.percentOff}% off)`;
    }
    if (promoInfo && promoInfo.amountOff) {
        return `($${promoInfo.amountOff / 100} off)`;
    }
    return '';
};

export const getPlanName = (promoInfo: PromoCodeInfo | null, planType: string): string => {
    if (planType === 'FREE') {
        return 'NO PAYMENT';
    }
    return `${planType} PAYMENT ${getDiscountInfoText(promoInfo)}`;
};

export const getAfterDiscountPrice = (price: number, promoInfo: PromoCodeInfo | null): number => {
    if (promoInfo && promoInfo.percentOff) {
        return round((price * (100 - promoInfo.percentOff)) / 100, 2);
    }
    if (promoInfo && promoInfo.amountOff) {
        return round(price - promoInfo.amountOff / 100, 2);
    }
    return 0;
};

export const getPlanPrice = (price: number, planType: string): number => {
    return round(planType === 'YEARLY' ? price / 12 : price, 2);
};

export const freePlanCategoryCheck = (category: string) => {
    const categories = ['ADULT_SEXUAL_CONTENT', 'GAMBLING', 'VIOLENCE', 'INAPPROPRIATE_FOR_MINORS'];

    return categories.includes(category);
};
