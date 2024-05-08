import { PromoCodeInfo } from './PromotionalCodeCard.type';

export const generatePromoCodeDescription = (promoCode: PromoCodeInfo): string => {
    if (promoCode.percentOff) {
        return `You will get ${promoCode.percentOff}% discount on chosen plan.`;
    }
    if (promoCode.amountOff) {
        return `You will get $${promoCode.amountOff / 100} discount on chosen plan.`;
    }
    return '';
};
