import { DynamicModule, Global, Module, Scope } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { WinstonModule, WinstonModuleAsyncOptions, WinstonModuleOptions } from 'nest-winston';

@Global()
@Module({
    imports: [],
    providers: [],
    exports: [],
})
export class LoggingModule {
    static updateModule(module: DynamicModule): DynamicModule {
        const provider = {
            provide: LoggingService,
            useClass: LoggingService,
            scope: Scope.TRANSIENT,
        };

        return {
            module: module.module,
            imports: module.imports,
            providers: [...module.providers, provider],
            exports: [...module.exports, provider],
        };
    }

    static forRootAsync(options: WinstonModuleAsyncOptions): DynamicModule {
        const winstonModule = WinstonModule.forRootAsync(options) as DynamicModule;
        return LoggingModule.updateModule(winstonModule);
    }

    static forRoot(options: WinstonModuleOptions): DynamicModule {
        const winstonModule = WinstonModule.forRoot(options) as DynamicModule;
        return LoggingModule.updateModule(winstonModule);
    }
}
