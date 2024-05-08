export class PromotionCodeDto {
    active: boolean;
    expiresAt: number;
    redeemBy?: number;
    currency?: string;
    percentOff?: number;
    amountOff?: number;
    code?: string;
    id?: string;
    metadata?: {};
    coupon?: string;
    apiKey?: string;
    customer?: string;
    referrerAccountId?: string;
    times_redeemed?: number;
}
