import type {EmailTemplateInterface} from './email.interfaces';

export abstract class EmailTemplateService {
  abstract list(): Promise<EmailTemplateInterface[]>;

  abstract get(id: string): Promise<EmailTemplateInterface>;

  abstract create(template: EmailTemplateInterface): Promise<void>;

  abstract update(template: EmailTemplateInterface): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
