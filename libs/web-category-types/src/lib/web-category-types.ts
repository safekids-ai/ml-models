
type WebCategoryType = {
  id: number,
  description: string
}

enum WebCategoryProviderType {
  OPENAI,
  GROQ
}

enum WebCategoryTypesEnum {
  EXPLICIT = 1000,
  SELF_BODY_IMAGE = 2000,
  CLOTHING_FASHION = 3000,
  CRIMINAL_MALICIOUS = 4000,
  DRUGS_ALCOHOL = 5000,
  ENTERTAINMENT_NEWS_STREAMING = 6000,
  ONLINE_GAMES = 7000,
  GAMBLING = 8000,
  HATE_SPEECH = 9000,
  SOCIAL_MEDIA_CHAT = 10000,
  SELF_HARM = 11000,
  SEX_EDUCATION = 12000,
  SHOPPING_PRODUCT_REVIEWS = 13000,
  VIOLENCE = 14000,
  WEAPONS = 15000,
  PROXY_VPN = 16000,
  INAPPROPRIATE_FOR_MINORS = 17000,
  PHISHING_FRAUD = 18000,
  TERRORISM = 19000,
  EXTREME_POLITICAL_VIEWS = 20000,
  CYBER_BULLYING = 21000,
  UNREGULATED_CHAT_ROOMS = 22000,
  UNVERIFIED_MEDICAL_INFORMATION = 23000,
  NONE_OF_ABOVE = 100000
}

const WEB_CATEGORY_TYPES: WebCategoryType[] = [
  {"id": WebCategoryTypesEnum.EXPLICIT, "description": "Adult Sexual Content"},
  {"id": WebCategoryTypesEnum.SELF_BODY_IMAGE, "description": "Body Image/Related to Disordered Eating"},
  {"id": WebCategoryTypesEnum.CLOTHING_FASHION, "description": "Clothing, Fashion and Jewelry"},
  {"id": WebCategoryTypesEnum.CRIMINAL_MALICIOUS, "description": "Criminal/Malicious"},
  {"id": WebCategoryTypesEnum.DRUGS_ALCOHOL, "description": "Drugs/Alcohol/Tobacco Related"},
  {"id": WebCategoryTypesEnum.ENTERTAINMENT_NEWS_STREAMING, "description": "Entertainment News and Streaming"},
  {"id": WebCategoryTypesEnum.ONLINE_GAMES, "description": "Online Games"},
  {"id": WebCategoryTypesEnum.GAMBLING, "description": "Gambling"},
  {"id": WebCategoryTypesEnum.HATE_SPEECH, "description": "Hate Speech"},
  {"id": WebCategoryTypesEnum.SOCIAL_MEDIA_CHAT, "description": "Social Media and Chat"},
  {"id": WebCategoryTypesEnum.SELF_HARM, "description": "Self Harm/Suicidal Content"},
  {"id": WebCategoryTypesEnum.SEX_EDUCATION, "description": "Sex Education"},
  {"id": WebCategoryTypesEnum.SHOPPING_PRODUCT_REVIEWS, "description": "Shopping and Product Reviews"},
  {"id": WebCategoryTypesEnum.VIOLENCE, "description": "Violence"},
  {"id": WebCategoryTypesEnum.WEAPONS, "description": "Weapons"},
  {"id": WebCategoryTypesEnum.PROXY_VPN, "description": "Proxy/Bypass Websites/VPN"},
  {"id": WebCategoryTypesEnum.INAPPROPRIATE_FOR_MINORS, "description": "Inappropriate for Minors"},
  {"id": WebCategoryTypesEnum.PHISHING_FRAUD, "description": "Phishing/Fraud"},
  {"id": WebCategoryTypesEnum.TERRORISM, "description": "Terrorism"},
  {"id": WebCategoryTypesEnum.EXTREME_POLITICAL_VIEWS, "description": "Extreme Political Views"},
  {"id": WebCategoryTypesEnum.CYBER_BULLYING, "description": "Cyberbullying"},
  {"id": WebCategoryTypesEnum.UNREGULATED_CHAT_ROOMS, "description": "Unregulated Chatrooms"},
  {"id": WebCategoryTypesEnum.UNVERIFIED_MEDICAL_INFORMATION, "description": "Unverified Medical Information"},
  {"id": WebCategoryTypesEnum.NONE_OF_ABOVE, "description": "Other/None of the Above"},
];

type WebMeta = {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: string;
  ogDescription?: string;
  ogUrl?: string;
}

export {WebCategoryType, WebCategoryProviderType, WebCategoryTypesEnum, WEB_CATEGORY_TYPES, WebMeta}
