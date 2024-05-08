import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';

@Module({
    providers: [FeatureService],
    exports: [FeatureService],
})
export class FeatureModule {}
