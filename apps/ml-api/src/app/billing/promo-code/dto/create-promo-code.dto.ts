export class CreatePromoCodeDto {
    accountId?: string;
    active: boolean;
    apiKey?: string;
    code?: string;
    coupon?: string;
    times_redeemed: number;
    createdBy?: string;
    expiresAt: Date;
    stripeCustomerId?: string;
    updatedBy?: string;
}
