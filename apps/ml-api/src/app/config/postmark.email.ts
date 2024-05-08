export interface PostmarkConfig {
  from: string
  from_support: string
  reply: string
  serverToken: string
}

export default () => ({
  postmarkConfig : {
    from: process.env.POSTMARK_EMAIL_FROM_EMAIL || 'SafeKids<notifications@safekids.dev>',
    from_support: process.env.POSTMARK_EMAIL_FROM_SUPPORT_EMAIL || 'support@safekids.dev',
    reply: process.env.POSTMARK_EMAIL_FROM_REPLYEMAIL || 'no-reply@safekids.dev',
    serverToken: process.env.POSTMARK_EMAIL_SERVER_TOKEN || "exampleToken"
  } as PostmarkConfig
});
