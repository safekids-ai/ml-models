export interface DefaultPlanConfig {
  plans: string[]
}export default () => ({
  defaultPlanConfig : {
    plans: [process.env.MONTHLY_PLAN, process.env.YEARLY_PLAN, process.env.FREE_PLAN]
  } as DefaultPlanConfig
});
