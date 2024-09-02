import {Module, Global} from '@nestjs/common';
import {BullModule} from "@nestjs/bullmq";
import {ConfigService} from '@nestjs/config';
import {QueueConfig} from "../config/queue";
import {UrlParser} from "../utils/url.util";
import {RedisConfig} from "../config/redis";

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const {host, port, password} = configService.get<RedisConfig>('redisConfig');
        return {
          connection: {host, port, password}
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {
}
