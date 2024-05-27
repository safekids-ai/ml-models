import {Inject, Injectable} from '@nestjs/common';
import type {EmailTemplateInterface, EmailTemplateServiceInterface} from './email.interfaces';

@Injectable()
export class EmailTemplateService implements EmailTemplateServiceInterface {
  templateCache: EmailTemplateInterface[] = null;

  constructor(@Inject('EmailTemplateServiceImpl') private readonly impl: EmailTemplateServiceInterface) {
  }

  async create(template: EmailTemplateInterface): Promise<void> {
    await this.impl.create(template);
    this.cacheInvalidate();
  }

  async delete(id: string): Promise<void> {
    await this.impl.delete(id);
    this.cacheInvalidate();
  }

  cacheInvalidate(): void {
    this.templateCache = null;
  }

  async deleteAll(): Promise<void> {
    await this.impl.deleteAll();
    this.cacheInvalidate();
  }

  async get(id: string): Promise<EmailTemplateInterface> {
    return await this.impl.get(id);
  }

  async list(): Promise<EmailTemplateInterface[]> {
    if (this.templateCache) {
      return this.templateCache;
    }
    this.templateCache = await this.impl.list();
    return this.templateCache
  }

  async update(template: EmailTemplateInterface): Promise<void> {
    await this.impl.update(template);
    this.cacheInvalidate();
  }
}
