import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { ConfigService } from '@nestjs/config';
import { BillingService } from '../billing.service';
import { FeatureService } from '../feature/feature.service';
import { PlanTypes } from './plan-types';
import { QueryException } from '../../error/common.exception';
import { CategoryStatus } from '../../category/category.status';
import { HttpStatus } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { QueryTypes } from 'sequelize';
import { Plan } from './entities/plan.entity';

class Fixture {
    static StripeService = class {
        static productExists = Fixture.getMock();
    };

    static InvoiceService = class {
        static findOne = Fixture.getMock();
    };

    static FeatureService = class {
        static get = Fixture.getMock();
    };

    static SUBSCRIPTION_REPOSITORY = class {
        static findAll = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static PLAN_REPOSITORY = class {
        static findOne = Fixture.getMock();
        static upsert = Fixture.getMock();
        static sequelize = { query: jest.fn() };
    };

    static PAYMENT_REPOSITORY = class {
        static findAll = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static getMock() {
        return jest.fn();
    }

    static getLoggingService() {
        return {
            className: Fixture.getMock(),
            debug: Fixture.getMock(),
            info: Fixture.getMock(),
            error: Fixture.getMock(),
        };
    }

    static getConfigService = class {
        static _isDevelopment = Fixture.getMock().mockReturnValue(true);
        static get = Fixture.getMock().mockReturnValue({
            plans: Array.of(
                {
                    name: 'Monthly Plan',
                    planType: 'MONTHLY',
                    price: 19.99,
                    tenure: 'MONTH',
                    currency: 'USD',
                    trialPeriod: 7,
                    productId: 'prod_Mm2ObJx9Kxx1LA',
                    priceId: 'price_1',
                },
                {
                    name: 'Yearly Plan',
                    planType: 'YEARLY',
                    price: 14.99,
                    tenure: 'YEAR',
                    currency: 'USD',
                    trialPeriod: 7,
                    productId: 'prod_Mm2QCdUD9JzaKX',
                    priceId: 'price_12',
                },
                {
                    name: 'Free Plan',
                    planType: 'FREE',
                    price: 0,
                    tenure: 'FREE',
                    currency: 'USD',
                    trialPeriod: 0,
                    productId: 'prod_If',
                    priceId: 'price_1Ig',
                }
            ).map((p) => JSON.stringify(p)),
        });
    };

    static UserService = class {
        static findOneById = Fixture.getMock();
        static findParentsForAccount = Fixture.getMock();
    };
}

describe('Plan Service tests', () => {
    let service: PlanService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlanService,
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
                {
                    provide: BillingService,
                    useValue: Fixture.StripeService,
                },
                {
                    provide: InvoiceService,
                    useValue: Fixture.InvoiceService,
                },
                {
                    provide: FeatureService,
                    useValue: Fixture.FeatureService,
                },
                {
                    provide: 'SUBSCRIPTION_REPOSITORY',
                    useValue: Fixture.SUBSCRIPTION_REPOSITORY,
                },
                {
                    provide: 'PLAN_REPOSITORY',
                    useValue: Fixture.PLAN_REPOSITORY,
                },
                {
                    provide: 'PAYMENT_REPOSITORY',
                    useValue: Fixture.PAYMENT_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<PlanService>(PlanService);
    });

    it('Should find plans successfully', async () => {
        //given
        const plans = [
            { planType: PlanTypes.FREE, id: 'id', name: 'name' },
            { planType: PlanTypes.YEARLY, id: 'id', name: 'name' },
        ];

        //mock dependencies
        Fixture.PLAN_REPOSITORY.sequelize.query.mockResolvedValueOnce(plans);

        //when
        await service.findAll();

        //then
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
        const queryOptions = {
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: Plan,
        };
        expect(Fixture.PLAN_REPOSITORY.sequelize.query.mock.calls[0][0]).toEqual(query);
        expect(Fixture.PLAN_REPOSITORY.sequelize.query.mock.calls[0][1]).toEqual(queryOptions);
    });

    it('Should find plan by id successfully', async () => {
        //given
        const id = 'id';
        //mock dependencies
        Fixture.PLAN_REPOSITORY.findOne.mockResolvedValueOnce({ planType: PlanTypes.FREE });

        //when
        await service.findOne(id);

        //then
        expect(Fixture.PLAN_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should find plan by type successfully', async () => {
        //given
        const planType = PlanTypes.FREE;

        //mock dependencies
        Fixture.PLAN_REPOSITORY.findOne.mockResolvedValueOnce({ planType: PlanTypes.FREE });

        //when
        await service.findOneByType(planType);

        //then
        expect(Fixture.PLAN_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should find current plan by account id successfully', async () => {
        //given
        const accountId = 'accountId';
        const subscription = {
            planId: 'planId',
            id: 'id',
        };

        //mock dependencies
        Fixture.SUBSCRIPTION_REPOSITORY.findOne.mockResolvedValueOnce(subscription);
        Fixture.PLAN_REPOSITORY.findOne.mockResolvedValueOnce({ id: 'id', name: 'Free plan' });
        const invoice = {
            ext_payment_attempt: 1670239270,
            subtotal: 1000,
            total: 1000,
            amount_paid: 1000,
            amount_due: 1000,
            amount_remaining: 1000,
        };
        Fixture.InvoiceService.findOne.mockResolvedValueOnce(invoice);

        //when
        await service.findOneByAccountId(accountId);

        //then
        expect(Fixture.SUBSCRIPTION_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.SUBSCRIPTION_REPOSITORY.findOne).toHaveBeenCalledWith({
            where: { accountId },
        });
    });

    it('Should seed plans successfully', async () => {
        //given

        //mock dependencies
        Fixture.StripeService.productExists.mockResolvedValueOnce(true);
        Fixture.StripeService.productExists.mockResolvedValueOnce(true);
        Fixture.StripeService.productExists.mockResolvedValueOnce(true);

        //when
        await service.seedDefaultPlans();

        //then
        expect(Fixture.PLAN_REPOSITORY.upsert).toHaveBeenCalledTimes(3);
    });

    it.skip('Should throw error if exception occurs while seeding plans', async () => {
        //mock dependencies
        jest.spyOn(Fixture.PLAN_REPOSITORY, 'upsert').mockImplementationOnce(async () => {
            throw new QueryException(QueryException.upsert());
        });

        //when
        service.seedDefaultPlans().catch((e) => {
            //then
            expect(Fixture.PLAN_REPOSITORY.upsert).toHaveBeenCalledTimes(1);
            expect(Fixture.PLAN_REPOSITORY.upsert).toHaveBeenNthCalledWith(1, {
                id: 'ALCOHOL',
                name: 'Alcohol',
                enabled: false,
                schoolDefault: false,
                editable: false,
                status: CategoryStatus.ASK,
                timeDuration: 30,
            });

            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.upsert());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });
});
