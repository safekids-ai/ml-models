interface EmailContentInterface {
  body?: string;
  subject?: string;
  templateName?: string;
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

interface QueueServiceInterface {
  wireListener(): Promise<void>;

  sendMessage?(message): Promise<void>;
}

export type {
  QueueServiceInterface,
  EmailTemplateInterface,
  EmailContentInterface,
  EmailInterface
}
