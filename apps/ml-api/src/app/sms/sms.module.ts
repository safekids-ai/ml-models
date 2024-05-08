import { DynamicModule, Global, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { LoggingModule } from '../logger/logging.module';
import { LoggingService } from '../logger/logging.service';

@Global()
@Module({
    imports: [],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {
    static forRootAsync(options): DynamicModule {
        const implProvider = {
            provide: options.provide,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        return {
            module: SmsModule,
            imports: [LoggingModule],
            providers: [implProvider, LoggingService],
            exports: [implProvider],
        };
    }
}
