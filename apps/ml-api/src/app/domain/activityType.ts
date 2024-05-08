import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface activityTypeAttributes {
    id?: number;
    type: string;
}

@Table({ tableName: 'activity_type', timestamps: false })
export class activityType extends Model<activityTypeAttributes, activityTypeAttributes> implements activityTypeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;

    @Column({ type: DataType.STRING(45) })
    type!: string;

    @Column({ type: DataType.STRING(60) })
    label!: string;
}
