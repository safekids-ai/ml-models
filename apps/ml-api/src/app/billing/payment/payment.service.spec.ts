import { AccountService } from './../../accounts/account.service';
import { CustomerService } from './../customer/customer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { BillingService } from '../billing.service';
import { LoggingService } from '../../logger/logging.service';

class Fixture {
    static getLoggingService = class {
        static className = Fixture.getMock();
        static debug = Fixture.getMock();
        static info = Fixture.getMock();
        static error = Fixture.getMock();
    };
    static BillingService = class {
        static createPaymentIntent = Fixture.getMock();
        static getPaymentMethod = Fixture.getMock().mockReturnValue({});
    };

    static CustomerService = class {
        static updateCustomer = Fixture.getMock();
    };

    static AccountService = class {
        static findOne = Fixture.getMock();
    };

    static PAYMENT_REPOSITORY = class {
        static create = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static getMock() {
        return jest.fn();
    }
}

describe('Payment Service test', () => {
    let service: PaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: BillingService,
                    useValue: Fixture.BillingService,
                },
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService,
                },
                {
                    provide: CustomerService,
                    useValue: Fixture.CustomerService,
                },
                {
                    provide: AccountService,
                    useValue: Fixture.AccountService,
                },
                {
                    provide: 'PAYMENT_REPOSITORY',
                    useValue: Fixture.PAYMENT_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
    });

    it('Should create payment intent', async () => {
        //given
        const accountId = 'accountId';

        //mock dependencies
        const account = Fixture.AccountService.findOne.mockResolvedValueOnce({ stripeCustomerId: 'stripeCustomerId' });
        Fixture.BillingService.createPaymentIntent.mockResolvedValueOnce({ client_secret: 'client_secret' });

        //when
        await service.createPaymentIntent(accountId);

        // then
        expect(Fixture.AccountService.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.BillingService.createPaymentIntent).toHaveBeenCalledTimes(1);
    });

    it('Should save payment method', async () => {
        //given
        const accountId = 'accountId';
        const paymentMethodId = 'paymentMethodId';

        //received
        const payments = {
            card: {
                last4: 'lastDigits',
                exp_month: 'expiryMonth',
                exp_year: 'expiryYear',
            },
        };

        const paymentDetails = {
            accountId: 'accountId',
            paymentMethodId: 'paymentMethodId',
            lastDigits: 'lastDigits',
            expiryMonth: 'expiryMonth',
            expiryYear: 'expiryYear',
        };

        //mock dependencies
        Fixture.AccountService.findOne.mockResolvedValueOnce({ stripeCustomerId: 'stripeCustomerId' });
        Fixture.BillingService.getPaymentMethod.mockResolvedValueOnce(payments);
        Fixture.PAYMENT_REPOSITORY.create.mockResolvedValue(true);

        //when
        const result = await service.savePaymentMethod(accountId, paymentMethodId);

        //then
        expect(result).toBeTruthy();
        expect(Fixture.AccountService.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.BillingService.getPaymentMethod).toHaveBeenCalledTimes(1);
        expect(Fixture.PAYMENT_REPOSITORY.create).toHaveBeenCalledTimes(1);
    });

    it('Should find one payment method', async () => {
        //given
        const accountId = 'accountId';

        //received
        const paymentDetails = {
            accountId: 'accountId',
            paymentMethodId: 'paymentMethodId',
            lastDigits: 'lastDigits',
            expiryMonth: 'expiryMonth',
            expiryYear: 'expiryYear',
        };

        //mock dependencies
        Fixture.PAYMENT_REPOSITORY.findOne.mockReturnValue(paymentDetails);

        //when
        const result = await service.findOne(accountId);

        //then
        expect(result).toBeTruthy();
        expect(Fixture.PAYMENT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
    });
});
