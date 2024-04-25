export class CreateSubscriptionDto {
    id: string;
    planId?: string;
    status: string;
    trialStartTime: Date;
    trialEndTime: Date; //same
    subscriptionStartTime: Date;
    subscriptionEndTime: Date; //same
    trialUsed: boolean;
    accountId: string;
    cancelAtPeriodEnd?: boolean;
    coupon?: string;
    promotionCode?: string;
}
