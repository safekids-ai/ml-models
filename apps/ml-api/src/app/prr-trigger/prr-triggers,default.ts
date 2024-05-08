export const defaultPrrTriggers = [
    { id: 'AI-VISION', trigger: 'ai-vision' },
    { id: 'AI-NLP', trigger: 'ai-nlp' },
    { id: 'AI-NLP-VISION', trigger: 'ai-nlp-vision' },
    { id: 'URL-INTERCEPTED', trigger: 'url-intercepted' },
];

export enum PrrTriggers {
    AI_NLP = 'AI-NLP',
    AI_NLP_VISION = 'AI-NLP-VISION',
    AI_VISION = 'AI-VISION',
    URL_INTERCEPTED = 'URL-INTERCEPTED',
}
