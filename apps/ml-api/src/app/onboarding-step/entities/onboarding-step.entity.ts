import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface OnBoardingStepAttributes {
    id: number;
    step: string;
    description: string;
}

interface OnBoardingStepCreationAttributes extends Optional<OnBoardingStepAttributes, 'id'> {}

@Table({ tableName: 'onboarding_step' })
export class OnBoardingStep extends Model<OnBoardingStepAttributes, OnBoardingStepCreationAttributes> {
    @Column({ primaryKey: true, field: 'id', allowNull: false, type: DataType.INTEGER })
    id: number;

    @Column({ field: 'step', allowNull: false, type: DataType.STRING(20) })
    step: string;

    @Column({ field: 'description', allowNull: true, type: DataType.STRING(50) })
    description: string;
}
