import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { BillingService } from '../billing.service';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static BillingService = class {
        static createCustomer = Fixture.getMock();
        static updateCustomer = Fixture.getMock();
    };
}

describe('Customer service unit tests', () => {
    let service: CustomerService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerService,
                {
                    provide: BillingService,
                    useValue: Fixture.BillingService,
                },
            ],
        }).compile();

        service = module.get<CustomerService>(CustomerService);
    });
    it('Should create customer successfully', async () => {
        //given
        const accountId = 'accountId';
        const email = 'email';
        const name = 'name';

        //when
        await service.createCustomer(accountId, email, name);

        //then
        expect(Fixture.BillingService.createCustomer).toHaveBeenCalledTimes(1);
    });
    it('Should update customer successfully', async () => {
        //given
        const customerId = 'customerId';
        const paymentMethodId = 'paymentMethodId';

        //when
        await service.updateCustomer(customerId, paymentMethodId);

        //then
        expect(Fixture.BillingService.updateCustomer).toHaveBeenCalledTimes(1);
    });
});
