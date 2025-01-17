import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {WebCategoryTypesEnum} from '@safekids-ai/web-category-types'


export class WebCategoryCodes {
  private static readonly CATEGORIES_CODES = {
    [WebCategoryTypesEnum.SEX_EDUCATION]: {
      level: PrrLevel.ONE,
      key: 'sex_education',
      category: PrrCategory.SEX_EDUCATION,
      categoryName: 'Sex Education',
      name: 'Sex Education',
      minProbability: 0.5,
      status: UrlStatus.ALLOW,
    },
    [WebCategoryTypesEnum.INAPPROPRIATE_FOR_MINORS]: {
      level: PrrLevel.ONE,
      key: 'inappropriate_for_minors',
      categoryName: 'Inappropriate for Minors',
      category: PrrCategory.INAPPROPRIATE_FOR_MINORS,
      name: 'Child Inappropriate',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.GAMBLING]: {
      level: PrrLevel.ONE,
      key: 'gambling',
      categoryName: 'Gambling',
      category: PrrCategory.GAMBLING,
      name: 'Gambling',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.EXPLICIT]: {
      level: PrrLevel.ONE,
      key: 'adult_sexual_content',
      categoryName: 'Adult Sexual Content',
      category: PrrCategory.ADULT_SEXUAL_CONTENT,
      name: 'Pornography',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },

    [WebCategoryTypesEnum.PROXY_VPN]: {
      level: PrrLevel.ONE,
      key: 'proxy',
      categoryName: 'Proxy/VPN',
      category: PrrCategory.PROXY,
      name: 'Proxy and VPN Bypass Sites',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },

    [WebCategoryTypesEnum.TERRORISM]: {
      level: PrrLevel.THREE,
      key: 'terrorism',
      categoryName: 'Terrorism',
      category: PrrCategory.VIOLENCE,
      name: 'Terrorism Related Content',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },

    [WebCategoryTypesEnum.CYBER_BULLYING]: {
      level: PrrLevel.ONE,
      key: 'inappropriate_for_minors',
      categoryName: 'Inappropriate for Minors',
      category: PrrCategory.INAPPROPRIATE_FOR_MINORS,
      name: 'Cyberbullying',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },

    [WebCategoryTypesEnum.DRUGS_ALCOHOL]: {
      level: PrrLevel.ONE,
      key: 'tobacco',
      categoryName: 'Tobacco',
      category: PrrCategory.DRUGS_ALCOHOL_TOBACCO,
      name: 'Drug, Alcohol or Tobacco Related',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },

    [WebCategoryTypesEnum.VIOLENCE]: {
      level: PrrLevel.THREE,
      key: 'violence',
      categoryName: 'Violence',
      category: PrrCategory.VIOLENCE,
      name: 'Violence',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.WEAPONS]: {
      level: PrrLevel.THREE,
      key: 'weapons',
      categoryName: 'Weapons',
      category: PrrCategory.WEAPONS,
      name: 'Weapons',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.CRIMINAL_MALICIOUS]: {
      level: PrrLevel.THREE,
      key: 'criminal_malicious',
      category: PrrCategory.CRIMINAL_MALICIOUS,
      categoryName: 'Criminal/Malicious',
      name: 'Criminal/Malicious',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.HATE_SPEECH]: {
      level: PrrLevel.ONE,
      key: 'hate_speech',
      categoryName: 'Hate Speech',
      category: PrrCategory.HATE_SPEECH,
      name: 'Hate Speech',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.SELF_HARM]: {
      level: PrrLevel.THREE,
      key: 'self_harm_suicidal_content',
      category: PrrCategory.SELF_HARM_SUICIDAL_CONTENT,
      categoryName: 'Self Harm/Suicidal Content',
      name: 'Self Harm',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.SOCIAL_MEDIA_CHAT]: {
      level: PrrLevel.ONE,
      key: 'social_media_chat',
      category: PrrCategory.SOCIAL_MEDIA_CHAT,
      categoryName: 'Social Media and Chat',
      name: 'Social Media Chat',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.ENTERTAINMENT_STREAMING_VIDEO]: {
      level: PrrLevel.ONE,
      key: 'entertainment_news_streaming',
      categoryName: 'Entertainment News and Streaming',
      category: PrrCategory.ENTERTAINMENT_NEWS_STREAMING,
      name: 'Entertainment News & Celebrity Sites',
      minProbability: 0.5,
      status: UrlStatus.ALLOW,
    },
    [WebCategoryTypesEnum.CLOTHING_FASHION_BEAUTY]: {
      level: PrrLevel.ONE,
      key: 'clothing_fashion_jewelry',
      categoryName: 'Clothing, Fashion and Jewelry',
      category: PrrCategory.CLOTHING_FASHION_JEWELRY,
      name: 'Clothing Fashion and Jewelry',
      minProbability: 0.5,
      status: UrlStatus.ALLOW,
    },
    [WebCategoryTypesEnum.SELF_BODY_IMAGE]: {
      level: PrrLevel.ONE,
      key: 'body_image',
      category: PrrCategory.BODY_IMAGE,
      categoryName: 'Body Image/Related to Disordered Eating',
      name: 'Body Image/Related to Disordered Eating',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.ONLINE_GAMES]: {
      level: PrrLevel.ONE,
      key: 'online_gaming',
      categoryName: 'Online Gaming',
      category: PrrCategory.ONLINE_GAMING,
      name: 'Gaming',
      minProbability: 0.5,
      status: UrlStatus.ALLOW,
    },
    [WebCategoryTypesEnum.PHISHING_FRAUD]: {
      level: PrrLevel.ONE,
      key: 'criminal_malicious',
      category: PrrCategory.CRIMINAL_MALICIOUS,
      categoryName: 'Criminal/Malicious',
      name: 'Phishing/Fraud',
      minProbability: 0.5,
      status: UrlStatus.BLOCK,
    },
    [WebCategoryTypesEnum.SHOPPING_PRODUCT_REVIEWS]: {
      level: PrrLevel.ONE,
      key: 'shopping_product_reviews',
      category: PrrCategory.SHOPPING_PRODUCT_REVIEWS,
      categoryName: 'Shopping and Product Reviews',
      name: 'Shopping and Product Reviews',
      minProbability: 0.5,
      status: UrlStatus.ALLOW,
    },
  };

  private static readonly webCategoryCategoricalCodes: Record<string, {
    categoryName: string;
    name: string;
    minProbability: number;
    status: UrlStatus
  }> =
    WebCategoryCodes.CATEGORIES_CODES;

  static get() {
    return this.webCategoryCategoricalCodes;
  }

  static hasCode(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.webCategoryCategoricalCodes, key);
  }
}
