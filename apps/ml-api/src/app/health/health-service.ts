import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HEALTH_REPOSITORY } from '../constants';
import { Health } from './health.entity';
import { LoggingService } from '../logger/logging.service';
import TWILIO from 'twilio';
import * as postmark from 'postmark';
import Queue from 'bee-queue';

const {Twilio} = TWILIO

@Injectable()
export class HealthService {
    private static readonly REGION = 'us-east-1';
    constructor(
        @Inject(HEALTH_REPOSITORY)
        private readonly healthRepository: typeof Health,
        private readonly log: LoggingService
    ) {}

    async check(): Promise<void> {
        try {
            await Promise.all([this.db(), this.sms(), this.beeQueue(), this.postmarkEmail()]);
        } catch (ex) {
            throw new HttpException(ex, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    //Database check
    private async db(): Promise<void> {
        await this.healthRepository.create({ name: 'test' });
        await this.healthRepository.destroy({ where: {} });
        const result = await this.healthRepository.findAll();
        if (result.length === 0) {
            return;
        }
        throw new HttpException('Health check failed.', HttpStatus.SERVICE_UNAVAILABLE);
    }
    // Bee queue Service
    private async beeQueue(): Promise<void> {
        try {
        const queue = new Queue('health');
        const result = await queue.ready()
        if(!result.isRunning()) {
            throw new HttpException('Health check failed: Bee queue service is offline', HttpStatus.SERVICE_UNAVAILABLE);
        }
        return;
        } catch(err) {
            console.log('unreadyable', err);
            throw new HttpException('Health check failed: Bee queue service is offline', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    // Postmark Email Service
    private async postmarkEmail(): Promise<void> {
        const client = new postmark.ServerClient(process.env.POSTMARK_EMAIL_SERVER_TOKEN);
        const response : postmark.Models.Templates = await client.getTemplates();
        if (response.TotalCount >= 0) {
            return;
        }
        throw new HttpException('Health check failed: Postmark email service is offline', HttpStatus.SERVICE_UNAVAILABLE);
    }
    //Twilio SMS Service
    private async sms(): Promise<void> {
        const client = new Twilio(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
        let active : boolean = false;
        await client.api.v2010.accounts(process.env.TWILIO_ACCOUNTSID).fetch().then(account => {
            if (account.status === 'active') {
                active = true;
            }
        })
        if (!active) {
            throw new HttpException('Health check failed: Twilio service is offline!', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
