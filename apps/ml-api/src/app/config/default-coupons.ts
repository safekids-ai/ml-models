export interface DefaultCouponConfig {
  plans: [string]
}
export default () => ({
  defaultCouponConfig: {
    plans: [process.env.DEFAULT_COUPON]
  } as DefaultCouponConfig,
})
