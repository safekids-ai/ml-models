import { Body, Controller, Delete, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';
import { SubscriptionValidator } from './validation/subscription-validator.service';
import { PlanValidator } from './validation/plan-validator.service';
import { SubscriptionPlanValidator } from './validation/subscription-plan-validator.service';
import { SubscriptionFeedbackDto } from '../subscription-feedback/dto/subscription-feedback-dto';

@ApiTags('Billing -> Subscription')
@Controller('v2/billing/subscriptions')
export class SubscriptionController {
    constructor(private readonly service: SubscriptionService) {}

    @ApiOperation({ summary: 'Create subscription.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard, SubscriptionValidator, PlanValidator)
    @Post(':planId')
    public async createStripeSubscription(@Request() req, @Param('planId') planId: string, @Query('promotioncode') promotionCode: string): Promise<void> {
        await this.service.createStripeSubscription(req.user.accountId, planId, promotionCode);
    }

    @ApiOperation({ summary: 'Update subscription.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard, SubscriptionPlanValidator, PlanValidator)
    @Put(':planId')
    public async updateSubscription(@Request() req, @Param('planId') planId: string, @Query('promotioncode') promotionCode: string): Promise<void> {
        await this.service.updateStripeSubscription(req.user.accountId, planId, promotionCode);
    }

    @ApiOperation({ summary: 'Cancel subscription when period ends.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Delete()
    public async cancelSubscriptionAtPeriodEnd(@Request() req, @Body() dto: SubscriptionFeedbackDto): Promise<void> {
        dto.accountId = req.user.accountId;
        await this.service.cancelSubscriptionAtPeriodEnd(dto);
    }
}
