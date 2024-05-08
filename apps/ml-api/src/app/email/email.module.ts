import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggingModule } from '../logger/logging.module';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email.template.service';

@Global()
@Module({
    imports: [],
    providers: [EmailService, EmailTemplateService],
    exports: [EmailService, EmailTemplateService],
})
export class EmailModule {
    static forRootAsync(options): DynamicModule {
        const emailImplProvider = {
            provide: options.email.provide,
            useFactory: options.email.useFactory,
            inject: options.email.inject || [],
        };

        const emailTemplateImplProvider = {
            provide: options.emailtemplate.provide,
            useFactory: options.emailtemplate.useFactory,
            inject: options.emailtemplate.inject || [],
        };

        return {
            module: EmailModule,
            imports: [LoggingModule],
            providers: [EmailService, EmailTemplateService, emailImplProvider, emailTemplateImplProvider],
            exports: [EmailService, EmailTemplateService],
        };
    }
}
