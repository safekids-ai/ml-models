import {Module, Global} from '@nestjs/common';
import {BullModule} from "@nestjs/bullmq";
import {ConfigService} from '@nestjs/config';
import {QueueConfig} from "../config/queue";
import {UrlParser} from "../utils/url.util";

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<QueueConfig>('queueConfig').url;
        const {host, port, password} = UrlParser.parseRedis(url)
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
