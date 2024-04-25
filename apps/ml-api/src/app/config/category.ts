export interface CategoryConfig {
  rootUrl: string
  categories: [string]
  cronPattern: string
}

export default () => ({
  categoryConfig : {
    rootUrl: process.env.CATEGORY_ROOT_URL || '',
    categories: (process.env.CATEGORY_LIST) ? JSON.parse(process.env.CATEGORY_LIST) : [],
    cronPattern: process.env.CATEGORY_CRON || '0 0 * * *',
  } as CategoryConfig
})
