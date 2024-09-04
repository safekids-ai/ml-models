export type WebCategoryType = {
  id: number,
  description: string
}

export enum WebCategoryProviderType {
  OPENAI,
  GROQ
}
export const WEB_CATEGORY_TYPES: WebCategoryType[] = [
  {"id": 10, "description": "Adult Sexual Content"},
  {"id": 20, "description": "Body Image/Related to Disordered Eating"},
  {"id": 25, "description": "Clothing, Fashion and Jewelry"},
  {"id": 30, "description": "Criminal/Malicious"},
  {"id": 40, "description": "Drugs/Alcohol/Tobacco Related"},
  {"id": 45, "description": "Entertainment News and Streaming"},
  {"id": 50, "description": "Online Games"},
  {"id": 60, "description": "Gambling"},
  {"id": 80, "description": "Hate Speech"},
  {"id": 90, "description": "Social Media and Chat"},
  {"id": 110, "description": "Self Harm/Suicidal Content"},
  {"id": 115, "description": "Sex Education"},
  {"id": 118, "description": "Shopping and Product Reviews"},
  {"id": 120, "description": "Violence"},
  {"id": 130, "description": "Weapons"},
  {"id": 140, "description": "Proxy/Bypass Websites/VPN"},
  {"id": 150, "description": "Inappropriate for Minors"},
  {"id": 160, "description": "Phishing/Fraud"},
  {"id": 170, "description": "Terrorism"},
  {"id": 180, "description": "Extreme Political Views"},
  {"id": 190, "description": "Cyberbullying"},
  {"id": 200, "description": "Unregulated Chatrooms"},
  {"id": 210, "description": "Unverified Medical Information"},
  {"id": 220, "description": "Other/None of the Above"},
]

export type WebMeta = {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: string;
  ogDescription?: string;
  ogUrl?: string;
}
