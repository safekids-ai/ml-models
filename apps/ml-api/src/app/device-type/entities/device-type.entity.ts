import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface DeviceTypeAttributes {
    id: string;
    name: string;
}

interface DeviceTypeCreationAttributes extends Optional<DeviceTypeAttributes, 'id'> {}

@Table({ tableName: 'device_type', timestamps: false })
export class DeviceType extends Model<DeviceTypeAttributes, DeviceTypeCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING })
    id?: string;

    @Column({ type: DataType.STRING(45) })
    name!: string;
}
