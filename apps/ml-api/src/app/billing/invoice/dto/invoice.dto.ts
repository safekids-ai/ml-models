export class InvoiceDto {
    nextPaymentDate: Date;
    totalPrice: string;
    afterPromo: string;
    amountPaid: string;
    amountDue: string;
    amountRemaining: string;
    accountId?: string;
    subscriptionId?: string;
}
