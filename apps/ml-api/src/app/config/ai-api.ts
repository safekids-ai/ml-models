export interface AiConfig {
  api_key: string,
  api_provider: string,
  ai_model: string

}

export default () => ({
  aiConfig: {
    api_provider: process.env.AI_PROVIDER,
    api_key: process.env.AI_API_KEY,
    ai_model: process.env.AI_PROVIDER_MODEL,
  } as AiConfig
});
