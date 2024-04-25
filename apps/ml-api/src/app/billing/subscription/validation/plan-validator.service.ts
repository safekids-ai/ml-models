import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationException } from '../../../error/common.exception';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionErrors } from '../subscription.errors';
import { PlanService } from '../../plan/plan.service';

@Injectable()
export class PlanValidator implements CanActivate {
    constructor(private readonly service: PlanService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        const plan = await this.service.findOne(request.params.planId);
        if (!plan) {
            throw new ValidationException(SubscriptionErrors.notExists(request.params.planId));
        }
        return true;
    }
}
