import {Inject, Injectable} from '@nestjs/common';
import {COUPON_REPOSITORY} from '../../constants';
import {Coupon} from './entities/coupon.entity';
import {CouponStatus} from './coupon.status.enum';
import {QueryException} from '../../error/common.exception';
import {ConfigService} from '@nestjs/config';
import {DefaultCouponConfig} from "../../config/default-coupons";

@Injectable()
export class CouponService {
  private readonly defaultCoupons;

  constructor(@Inject(COUPON_REPOSITORY) private readonly repository: typeof Coupon,
              private readonly config: ConfigService) {
    this.defaultCoupons = config.get<DefaultCouponConfig>('defaultCouponConfig').plans;
  }

  async findActiveCoupon() {
    return await this.repository.findOne({where: {status: CouponStatus.ACTIVE}});
  }

  /** Seed default coupons
   * @returns void
   */
  async seedDefaultCoupons(): Promise<void> {
    try {
      for (const coupon of this.defaultCoupons) {
        const p = JSON.parse(coupon);
        await this.repository.upsert(p);
      }
    } catch (error) {
      throw new QueryException(QueryException.upsert(error));
    }
  }
}
