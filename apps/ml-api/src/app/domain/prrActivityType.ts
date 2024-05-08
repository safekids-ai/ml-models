import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface prrActivityTypeAttributes {
    id?: number;
    activityType: string;
}

@Table({ tableName: 'prr_activity_type', timestamps: false })
export class prrActivityType extends Model<prrActivityTypeAttributes, prrActivityTypeAttributes> implements prrActivityTypeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'activity_type', type: DataType.STRING(45) })
    activityType!: string;
}
