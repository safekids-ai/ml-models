export interface OpenAIConfig {
  api_key: string
}

export default () => ({
  openAiConfig : {
    api_key: process.env.OPEN_AI_API_KEY
  } as OpenAIConfig
});
