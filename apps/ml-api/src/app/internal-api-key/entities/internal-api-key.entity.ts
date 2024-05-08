import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { API } from '../api.types';

export interface InternalApiKeyAttributes {
    service: API;
    key: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InternalApiKeyCreationAttributes extends InternalApiKeyAttributes {}

@Table({ tableName: 'internal_api_key' })
export class InternalApiKey extends Model<InternalApiKeyAttributes, InternalApiKeyCreationAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    service: API;

    @Column({ allowNull: false, type: DataType.STRING(150) })
    key: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
}
