import { Inject, Injectable } from '@nestjs/common';
import type { EmailInterface, EmailServiceInterface } from './email.interfaces';

@Injectable()
export class EmailService {
    constructor(
        @Inject('EmailServiceImpl')
        private readonly impl: EmailServiceInterface
    ) {}

    async sendEmail(email: EmailInterface): Promise<void> {
        return await this.impl.sendEmail(email);
    }
}
