import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface LicenseAttributes {
    id?: string;
    name: string;
    enabled?: boolean;
}

export interface LicenseCreationAttributes extends Optional<LicenseAttributes, 'id'> {}

@Table({ tableName: 'license' })
export class License extends Model<LicenseAttributes, LicenseCreationAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string;

    @Column({ type: DataType.STRING(200) })
    name!: string;

    @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    enabled: boolean;
}
