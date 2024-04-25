import { Inject, Injectable } from '@nestjs/common';
import type { EmailTemplateInterface, EmailTemplateServiceInterface } from './email.interfaces';

@Injectable()
export class EmailTemplateService implements EmailTemplateServiceInterface {
    constructor(@Inject('EmailTemplateServiceImpl') private readonly impl: EmailTemplateServiceInterface) {}

    async create(template: EmailTemplateInterface): Promise<void> {
        await this.impl.create(template);
    }

    async delete(id: string): Promise<void> {
        await this.impl.delete(id);
    }

    async get(id: string): Promise<EmailTemplateInterface> {
        return await this.impl.get(id);
    }

    async list(): Promise<EmailTemplateInterface[]> {
        return await this.impl.list();
    }

    async update(template: EmailTemplateInterface): Promise<void> {
        await this.impl.update(template);
    }
}
