export class PaymentResponseDto {
    paymentMethodID?: string;
    lastDigits: string;
    expiryMonth: number;
    expiryYear: number;
}
