import { COUPON_REPOSITORY } from '../../constants';
import { Coupon } from './entities/coupon.entity';

export const couponProviders = [
    {
        provide: COUPON_REPOSITORY,
        useValue: Coupon,
    },
];
