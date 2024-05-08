import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from './coupon.service';
import { CouponStatus } from './coupon.status.enum';
import { ConfigService } from '@nestjs/config';

const coupon = { id: '123', code: 'TEST', status: CouponStatus.ACTIVE };
class Fixture {
    static COUPON_REPOSITORY = class {
        static findOneByStatus = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static getMock() {
        return jest.fn();
    }

    static getConfigService = class {
        static _isDevelopment = Fixture.getMock().mockReturnValue(true);
        static get = Fixture.getMock().mockReturnValue({
            coupons: Array.of(coupon).map((p) => JSON.stringify(p)),
        });
    };
}
describe('CouponService', () => {
    let service: CouponService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
                CouponService,
                {
                    provide: 'COUPON_REPOSITORY',
                    useValue: Fixture.COUPON_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<CouponService>(CouponService);
    });

    it('should return active coupon', async () => {
        jest.spyOn(Fixture.COUPON_REPOSITORY, 'findOne').mockResolvedValue(coupon);

        const savedCoupon = await service.findActiveCoupon();

        expect(savedCoupon).toMatchObject(coupon);
    });
});
