export type Plan = {
    id: string;
    name: string;
    price: number;
    priceId: string;
    productId: string;
    tenure: string;
    currency: string;
    trialPeriod: Number;
    planType: string;
};
export type PaymentMethod = {
    id: string;
    paymentMethodId: string;
    lastDigits: string;
    expiryMonth: number;
    expiryYear: number;
};

export type ActivePlan = {
    accountId: string;
    cancelAtPeriodEnd: boolean;
    coupon: string;
    paymentMethodId: string;
    planId: string;
    planName: string;
    price: string;
    promotionCode: string;
    status: string;
    subscriptionEndTime: string;
    subscriptionId: string;
    subscriptionStartTime: string;
    trialEndTime: string;
    trialStartTime: string;
    trialUsed: boolean;
    upcomingInvoice: Invoice | null;
    type: string;
};

export type Invoice = {
    afterPromo: string;
    amountDue: string;
    amountPaid: string;
    amountRemaining: string;
    nextPaymentDate: string;
    totalPrice: string;
};
