import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { Status } from '../../status/entities/status.entity';
import { Optional } from 'sequelize';

export interface ServicesApiKeyAttributes {
    id: string;
    service: string;
    hostUrl: string;
    accessKey?: string;
    secret?: string;
    accountId?: string;
    statusId?: string;
}

export interface ServicesApiKeyCreationAttributes extends Optional<ServicesApiKeyAttributes, 'id'> {}

@Table({ tableName: 'api_key', timestamps: false })
export class ServicesApiKey extends Model<ServicesApiKeyAttributes, ServicesApiKeyCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    id?: string;

    @Column({ allowNull: false, type: DataType.STRING, unique: true })
    service: string;

    @Column({ field: 'host_url', type: DataType.STRING(300) })
    hostUrl!: string;

    @Column({ field: 'access_key', type: DataType.STRING(5000) })
    accessKey!: string;

    @Column({ allowNull: true, type: DataType.STRING(5000) })
    secret?: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    @BelongsTo(() => Status)
    status: Status;
}
