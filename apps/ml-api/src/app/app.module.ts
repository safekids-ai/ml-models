import {Logger, Module} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule, ConfigService} from '@nestjs/config';
import throttleConfig from "./config/throttle.config";
import modelConfig from "./config/model.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [throttleConfig, modelConfig]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get("throttle_config"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
