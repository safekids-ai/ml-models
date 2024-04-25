import { Module } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { PromoCodeController } from './promo-code.controller';
import { promoCodeProviders } from './promo-code.providers';
import { BillingModule } from '../billing-module';
import { UserModule } from '../../user/user.module';
import { AccountsModule } from '../../accounts/accounts.module';
import { SubscriptionModule } from '../subscription/subscription-module';
import { PlanModule } from '../plan/plan.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
    imports: [BillingModule, UserModule, AccountsModule, SubscriptionModule, PlanModule, CouponModule],
    controllers: [PromoCodeController],
    providers: [PromoCodeService, ...promoCodeProviders],
    exports: [PromoCodeService],
})
export class PromoCodeModule {}
