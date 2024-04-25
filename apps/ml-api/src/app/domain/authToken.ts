import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface authTokenAttributes {
    id: number;
    accessToken: string;
    refreshToken: string;
    expiresAt?: Date;
    createdAt: Date;
    userId: number;
    accountId: number;
    authenticator?: string;
}

@Table({ tableName: 'auth_token', timestamps: false })
export class authToken extends Model<authTokenAttributes, authTokenAttributes> implements authTokenAttributes {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id!: number;
    @Column({ field: 'access_token', type: DataType.STRING(300) })
    accessToken!: string;
    @Column({ field: 'refresh_token', type: DataType.STRING(300) })
    refreshToken!: string;
    @Column({ field: 'expires_at', allowNull: true, type: DataType.DATE })
    expiresAt?: Date;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'user_id', type: DataType.BIGINT })
    @Index({ name: 'fk_auth_token_user1_idx', using: 'BTREE', order: 'ASC', unique: false })
    userId!: number;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_auth_token_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    authenticator?: string;
}
