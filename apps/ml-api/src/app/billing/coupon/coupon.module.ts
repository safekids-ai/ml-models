import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { couponProviders } from './coupon.providers';

@Module({
    providers: [CouponService, ...couponProviders],
    exports: [CouponService],
})
export class CouponModule {}
