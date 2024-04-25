import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface deviceTypeAttributes {
    id?: number;
    type: string;
}

@Table({ tableName: 'device_type', timestamps: false })
export class deviceType extends Model<deviceTypeAttributes, deviceTypeAttributes> implements deviceTypeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    type!: string;
}
