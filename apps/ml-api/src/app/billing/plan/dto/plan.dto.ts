import { PlanTypes } from '../plan-types';
import { TenureTypes } from '../tenure-types';

export class PlanDto {
    id: string;
    name: string;
    planType: PlanTypes;
    price: string;
    priceId: string;
    productId: string;
    tenure: TenureTypes;
    currency: string;
    trialPeriod: number;
}
