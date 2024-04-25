import { Module } from '@nestjs/common';
import {MlController} from './ml.controller';
import {MlService} from './ml.service';
import {LoggingModule} from "../logger/logging.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [],
  providers: [MlService],
  exports: [MlService],
})
export class MlModule {}
