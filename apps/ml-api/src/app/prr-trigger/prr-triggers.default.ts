export const defaultPrrTriggers = [
  {id: 'AI-VISION', trigger: 'ai-vision'},
  {id: 'AI-NLP', trigger: 'ai-nlp'},
  {id: 'AI-NLP-VISION', trigger: 'ai-nlp-vision'},
  {id: 'URL-INTERCEPTED', trigger: 'url-intercepted'},
  {id: 'AI-WEB-CATEGORY', trigger: 'ai-web-category'},
];

export enum PrrTriggers {
  AI_NLP = 'AI-NLP',
  AI_NLP_VISION = 'AI-NLP-VISION',
  AI_VISION = 'AI-VISION',
  AI_WEB_CATEGORY = 'AI-WEB-CATEGORY',
  URL_INTERCEPTED = 'URL-INTERCEPTED',
}
