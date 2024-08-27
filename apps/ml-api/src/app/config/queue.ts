import retry from 'async-retry';

export interface QueueConfig {
  queueEmail: QueueConfigItem,
  queueSms: QueueConfigItem,
  queueActivity: QueueConfigItem,
  queueInformPRR: QueueConfigItem,
  queueGmailExtension: QueueConfigItem,
  url: string,
}

export interface QueueConfigItem {
  name: string
  workers: number
  batchOptions: {
    size: number,
    timeout: number
  },
  retryOptions?: retry.Options
}

export default () => ({
  queueConfig: {
    url: process.env.REDIS_URL,
    queueEmail: {
      name: "emailQueue",
      workers: process.env.QUEUE_EMAIL_WORKERS || 1,
      batchOptions: {
        size: process.env.QUEUE_EMAIL_BATCH || 5,
        timeout: process.env.QUEUE_EMAIL_BATCH_TIMEOUT || 2000,
      },
      retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 60000
      } as retry.Options
    } as QueueConfigItem,
    queueSms: {
      name: "smsQueue",
      workers: process.env.QUEUE_SMS_WORKERS || 1,
      batchOptions: {
        size: process.env.QUEUE_EMAIL_BATCH || 5,
        timeout: process.env.QUEUE_EMAIL_BATCH_TIMEOUT || 2000,
      },
      retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 60000
      } as retry.Options
    } as QueueConfigItem,
    queueActivity: {
      name: "activityQueue",
      workers: process.env.QUEUE_ACTIVITY_WORKERS || 1,
      batchOptions: {
        size: process.env.QUEUE_ACTIVITY_BATCH || 5,
        timeout: process.env.QUEUE_ACTIVITY_BATCH_TIMEOUT || 2000,
      },
      retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 60000
      } as retry.Options
    } as QueueConfigItem,
    queueInformPRR: {
      name: "informPRRQueue",
      workers: process.env.QUEUE_INFORMPRR_WORKERS || 1,
      batchOptions: {
        size: process.env.QUEUE_INFORMPRR_BATCH || 5,
        timeout: process.env.QUEUE_INFORMPRR_BATCH_TIMEOUT || 2000,
      },
      retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 60000
      } as retry.Options
    } as QueueConfigItem,
    queueGmailExtension: {
      name: "gmailExtensionQueue",
      workers: process.env.QUEUE_GMAILEXT_WORKERS || 1,
      batchOptions: {
        size: process.env.QUEUE_GMAILEXT_BATCH || 5,
        timeout: process.env.QUEUE_GMAILEXT_BATCH_TIMEOUT || 2000,
      },
      retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 60000
      } as retry.Options
    } as QueueConfigItem
  } as QueueConfig
})
