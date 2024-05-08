import { PromoCode } from './entities/promo-code.entity';
import { PROMO_CODE_REPOSITORY } from '../../constants';

export const promoCodeProviders = [
    {
        provide: PROMO_CODE_REPOSITORY,
        useValue: PromoCode,
    },
];
