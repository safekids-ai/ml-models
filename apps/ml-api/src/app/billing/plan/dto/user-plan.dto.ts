import { InvoiceDto } from '../../invoice/dto/invoice.dto';
import { PlanTypes } from '../plan-types';

export class UserPlanDto {
    subscriptionId: string;
    accountId: string;
    subscriptionStartTime: Date;
    subscriptionEndTime: Date;
    trialStartTime: Date;
    trialEndTime: Date;
    trialUsed: boolean;
    status: string;
    planName: string;
    planId: string;
    price: string;
    paymentMethodId: string;
    cancelAtPeriodEnd: boolean;
    type: PlanTypes;
    upcomingInvoice?: InvoiceDto;
}
