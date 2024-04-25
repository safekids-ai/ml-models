export class SubscriptionDto {
    id?: string;
    accountId: string;
    stripeCustomerId: string;
    priceId: string;
    trailPeriod: number;
    cancelAtPeriodEnd?: boolean;
    metaData: {
        planId: string;
        accountId: string;
        promotionCode?: string;
    };
    coupon?: string;
    promotionCodeId?: string;
}
