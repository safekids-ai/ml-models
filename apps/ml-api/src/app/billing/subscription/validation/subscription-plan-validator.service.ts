import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationException } from '../../../error/common.exception';
import { SubscriptionErrors } from '../subscription.errors';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class SubscriptionPlanValidator implements CanActivate {
    constructor(private readonly service: SubscriptionService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        const subscription = await this.service.findOneByAccountId(request.user.accountId);
        if (subscription && subscription.planId === request.params.planId) {
            throw new ValidationException(SubscriptionErrors.exists(request.user.accountId));
        }
        return true;
    }
}
