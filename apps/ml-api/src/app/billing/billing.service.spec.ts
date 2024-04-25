import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { LoggingService } from '../logger/logging.service';
import { StripeService } from './stripe.service';

class Fixture {
    static StripeService = class {
        static client = Fixture.getMock();
        static get = Fixture.get();
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

    static get() {
        return {
            customers: {
                retrieve: jest.fn(() => Promise.resolve({ id: 'id' })),
                create: jest.fn(() => Promise.resolve({ id: 'id' })),
                update: jest.fn(() => Promise.resolve({ id: 'id' })),
            },
            subscriptions: {
                retrieve: jest.fn(() => Promise.resolve({ id: 'id' })),
                create: jest.fn(() => Promise.resolve({ id: 'id' })),
                update: jest.fn(() => Promise.resolve({ id: 'id' })),
            },
        };
    }
}

describe('Billing Service tests', () => {
    let service: BillingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillingService,
                {
                    provide: 'StripeService',
                    useValue: Fixture.StripeService,
                },
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
            ],
        }).compile();

        jest.spyOn(Fixture.StripeService, 'client').mockReturnValueOnce(Fixture.get());
        service = module.get<BillingService>(BillingService);
    });

    it('Should create customer and return id', async () => {
        //given
        const accountId = 'accountId';
        const email = 'email';
        const name = 'name';

        //when
        const id = await service.createCustomer(accountId, email, name);

        //then
        expect(id).not.toBe(null);
    });
});
