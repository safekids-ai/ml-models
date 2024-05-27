interface EmailContentInterface {
  body?: string;
  subject?: string;
  templateName?: string;
  templateId?: string
}

interface EmailInterface {
  id?: string;
  meta?: any;
  from?: string;
  to: string | string[];
  reply?: string;
  content: EmailContentInterface;
  useSupportEmail?: boolean;
}

export interface EmailTemplateContentInterface {
  html: string;
  subject: string;
  text: string;
}

interface EmailTemplateInterface {
  id: string;
  name?: string;
  content?: EmailTemplateContentInterface;
  createdOn?: Date;
}

interface EmailTemplateServiceInterface {
  list(): Promise<EmailTemplateInterface[]>;

  get(id: string): Promise<EmailTemplateInterface>;

  create(template: EmailTemplateInterface): Promise<void>;

  update(template: EmailTemplateInterface): Promise<void>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;
}

interface EmailServiceInterface {
  sendEmail(email: EmailInterface): Promise<void>;
}

interface QueueServiceInterface {
  listener(): Promise<void>;

  sendMessage?(message): Promise<void>;
}

export type {
  EmailServiceInterface,
  QueueServiceInterface,
  EmailTemplateServiceInterface,
  EmailTemplateInterface,
  EmailContentInterface,
  EmailInterface
}
