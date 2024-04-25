export type CardValues = {
    cardNumber: string;
    cvc: string;
    expiryDate: string;
    name: string;
    postal_code: string;
};

export type PaypalValues = {
    email: string;
};

export type Values = { method: 'card' | 'paypal' } & (CardValues | PaypalValues);

export type CardErrors = Partial<CardValues>;

export type PayPalErrors = Partial<PaypalValues>;

export type State = {
    message?: string;
    status: 'error' | 'success';
};
