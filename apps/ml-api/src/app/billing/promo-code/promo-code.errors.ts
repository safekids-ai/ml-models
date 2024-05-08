export class PromoCodeErrors {
    static failed = (): string => {
        return `Failed to save promotion code.`;
    };

    static failedToGenerate() {
        return 'Failed to generate promotion code.';
    }

    static couponNotFound(promotionCode: string) {
        return `Coupon not found for promotion code[${promotionCode}]`;
    }

    static activeCouponNotFound() {
        return `Active Coupon not found.`;
    }
}
