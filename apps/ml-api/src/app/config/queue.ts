export interface QueueConfigRetryOptions {
  retries: number
  factor: number
  minTimeout: number
  maxTimeout: number
}

export interface QueueConfigItem {
  name: string
  url: string
  retryOptions?: QueueConfigRetryOptions
}

export interface QueueConfig {
  standardQueueEmail: QueueConfigItem,
  priorityQueueEmail: QueueConfigItem,
  queueSms: QueueConfigItem,
}

export default () => ({
  queueConfig: {
    standardQueueEmail: {
      name: "standardEmailQueue",
      url: process.env.REDIS_URL
    } as QueueConfigItem,
    priorityQueueEmail: {
      name: "priorityEmailQueue",
      url: process.env.REDIS_URL
    } as QueueConfigItem,
    queueSms: {
      name: "smsQueue",
      url: process.env.REDIS_URL
    } as QueueConfigItem
  } as QueueConfig
})
