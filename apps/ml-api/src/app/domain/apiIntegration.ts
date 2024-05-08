import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface apiIntegrationAttributes {
    id?: number;
    service: string;
    hostUrl: string;
    accessKey: string;
    secret: string;
    accountId: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
}

@Table({ tableName: 'api_integration', timestamps: false })
export class apiIntegration extends Model<apiIntegrationAttributes, apiIntegrationAttributes> implements apiIntegrationAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    service!: string;
    @Column({ field: 'host_url', type: DataType.STRING(100) })
    hostUrl!: string;
    @Column({ field: 'access_key', type: DataType.STRING(200) })
    accessKey!: string;
    @Column({ type: DataType.STRING(200) })
    secret!: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_api_integration_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
    @Column({ field: 'status_id', type: DataType.INTEGER })
    @Index({ name: 'fk_api_integration_status1_idx', using: 'BTREE', order: 'ASC', unique: false })
    statusId!: number;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
}
