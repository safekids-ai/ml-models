import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UUIDV4, Optional  } from 'sequelize';
import { PlanTypes } from '../plan-types';
import { TenureTypes } from '../tenure-types';

export interface PlanAttributes {
    id: string;
    name: string;
    price: string;
    priceId: string;
    productId: string;
    tenure: TenureTypes;
    currency: string;
    trialPeriod: number;
    planType: PlanTypes;
}

interface PlanCreationAttributes extends Optional<PlanAttributes, 'id'> {}

@Table({ tableName: 'plan', underscored: true, paranoid: true })
export class Plan extends Model<PlanAttributes, PlanCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    price: string;

    @Column({ field: 'price_id', type: DataType.STRING, allowNull: false, unique: true })
    priceId: string;

    @Column({ field: 'product_id', type: DataType.STRING, allowNull: false, unique: true })
    productId: string;

    @Column({
        type: DataType.ENUM,
        allowNull: false,
        values: [TenureTypes.YEAR, TenureTypes.MONTH, TenureTypes.FREE],
    })
    tenure: TenureTypes;

    @Column({ type: DataType.STRING, allowNull: false })
    currency: string;

    @Column({ field: 'trial_period', type: DataType.INTEGER, allowNull: false })
    trialPeriod: number;

    @Column({
        type: DataType.ENUM,
        allowNull: false,
        values: [PlanTypes.YEARLY, PlanTypes.MONTHLY, PlanTypes.FREE],
    })
    planType: PlanTypes;
}
