import { Injectable } from '@nestjs/common';
import { DefaultFeatureDto } from './dto/default-feature.dto';
import { FeatureInterface } from './dto/feature-interface';
import { PlanTypes } from '../plan/plan-types';

@Injectable()
export class FeatureService {
    private readonly monthlyFeatures: DefaultFeatureDto[];
    private readonly yearlyFeatures: DefaultFeatureDto[];

    constructor() {
        this.monthlyFeatures = [
            {
                id: 'GMAIL',
                name: 'Gmail Extension',
                enabled: false,
                interface: FeatureInterface.FE,
            },
            {
                id: 'SCHOOL',
                name: 'School Extension',
                enabled: false,
                interface: FeatureInterface.DESKTOP,
            },
            {
                id: 'CONSUMER',
                name: 'Consumer Extension',
                enabled: true,
                interface: FeatureInterface.DESKTOP,
            },
        ];
        this.yearlyFeatures = [
            {
                id: 'GMAIL',
                name: 'Gmail Extension',
                enabled: true,
                interface: FeatureInterface.FE,
            },
            {
                id: 'SCHOOL',
                name: 'School Extension',
                enabled: false,
                interface: FeatureInterface.DESKTOP,
            },
            {
                id: 'CONSUMER',
                name: 'Consumer Extension',
                enabled: true,
                interface: FeatureInterface.DESKTOP,
            },
        ];
    }

    get(planType: PlanTypes): DefaultFeatureDto[] {
        if (planType === PlanTypes.MONTHLY) {
            return this.monthlyFeatures;
        }
        return this.yearlyFeatures;
    }
}
