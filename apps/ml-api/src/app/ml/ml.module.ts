import { Module } from '@nestjs/common';
import {MlController} from './ml.controller';
import {MlService} from './ml.service';

@Module({
  controllers: [],
  providers: [MlService],
  exports: [MlService],
})
export class MlModule {}
