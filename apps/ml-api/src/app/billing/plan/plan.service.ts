import {Inject, Injectable} from '@nestjs/common';
import {PAYMENT_REPOSITORY, PLAN_REPOSITORY, SUBSCRIPTION_REPOSITORY} from '../../constants';
import {Plan} from './entities/plan.entity';
import {BillingService} from '../billing.service';
import {ConfigService} from '@nestjs/config';
import {QueryException} from '../../error/common.exception';
import {Subscription} from '../subscription/entities/subscription.entity';
import {UserPlanDto} from './dto/user-plan.dto';
import {PlanTypes} from './plan-types';
import {Payment} from '../payment/entities/payment.entity';
import {PlanDto} from './dto/plan.dto';
import {InvoiceService} from '../invoice/invoice.service';
import {QueryTypes} from 'sequelize';
import {DefaultPlanConfig} from "apps/ml-api/src/app/config/default-plans";
import {LoggingService} from "../../logger/logging.service";

@Injectable()
export class PlanService {
  private readonly defaultPlans;

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService,
    private readonly billingService: BillingService,
    @Inject(SUBSCRIPTION_REPOSITORY) private readonly sub_repository: typeof Subscription,
    @Inject(PAYMENT_REPOSITORY) private readonly payment_repository: typeof Payment,
    @Inject(PLAN_REPOSITORY) private readonly repository: typeof Plan,
    private readonly invoiceService: InvoiceService
  ) {
    this.defaultPlans = config.get<DefaultPlanConfig>('defaultPlanConfig').plans;
  }

  /** Find all default plans
   * @returns plans
   */
  async findAll(): Promise<PlanDto[]> {
    const query =
      'select ' +
      'id, ' +
      'name, ' +
      'price, ' +
      'plan_type , ' +
      'price_id , ' +
      'product_id , ' +
      'tenure, ' +
      'currency, ' +
      'trial_period ' +
      'from ' +
      'plan ' +
      'order by ' +
      'case ' +
      'when price = 0  ' +
      'then 0  ' +
      'else 1 ' +
      'end, ' +
      'price desc';

    return await this.repository.sequelize.query(query, {
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: Plan,
    });
  }

  /** Find plan
   * @param id
   * @returns plan
   */
  async findOne(id: string): Promise<Plan> {
    return await this.repository.findOne({where: {id}});
  }

  /** Find plan
   * @param planType
   * @returns plan
   */
  async findOneByType(planType: PlanTypes): Promise<Plan> {
    return await this.repository.findOne({where: {planType}});
  }

  /** Find plan by accountId
   * @param accountId id
   * @returns plan
   */
  async findOneByAccountId(accountId: string): Promise<UserPlanDto> {
    const subscription = await this.sub_repository.findOne({
      where: {accountId},
    });
    if (subscription) {
      const plan = await this.repository.findOne({where: {id: subscription.planId}});
      const payment = await this.payment_repository.findOne({where: {accountId}});
      const invoice = await this.invoiceService.findOne(accountId);
      const res = {
        subscriptionId: subscription.id,
        accountId,
        subscriptionStartTime: subscription.subscriptionStartTime,
        subscriptionEndTime: subscription.subscriptionEndTime,
        trialStartTime: subscription.trialStartTime,
        trialEndTime: subscription.trialEndTime,
        trialUsed: subscription.trialUsed,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        planName: plan.name,
        price: plan.price,
        planId: plan.id,
        type: plan.planType,
        paymentMethodId: payment?.paymentMethodId,
        coupon: subscription.coupon,
        promotionCode: subscription.promotionCode,
      } as UserPlanDto;
      if (invoice) {
        res.upcomingInvoice = {
          nextPaymentDate: invoice.nextPaymentDate,
          totalPrice: invoice.totalPrice,
          afterPromo: invoice.afterPromo,
          amountPaid: invoice.amountPaid,
          amountDue: invoice.amountDue,
          amountRemaining: invoice.amountRemaining,
        };
      }
      return res;
    }
  }

  /** Seed default plans
   * @returns void
   */
  async seedDefaultPlans(): Promise<void> {
    try {
      for (const plan of this.defaultPlans) {
        const p = JSON.parse(plan);
        if (await this.billingService.productExists(p.productId, p.priceId)) {
          await this.repository.upsert(p);
        } else {
          throw new QueryException(`${p.productId} or ${p.priceId} not exists.`);
        }
      }
    } catch (error) {
      throw new QueryException(QueryException.upsert(error));
    }
  }
}
