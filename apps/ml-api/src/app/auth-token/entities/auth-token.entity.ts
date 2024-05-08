import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../../user/entities/user.entity';

export interface AuthTokenAttributes {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    userId?: string;
    accountId?: string;
    authenticator?: string;
}

export interface AuthTokenCreationAttributes extends Optional<AuthTokenAttributes, 'id'> {}

@Table({ tableName: 'auth_token', timestamps: false })
export class AuthToken extends Model<AuthTokenAttributes, AuthTokenCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    id!: string;

    @Column({ field: 'access_token', type: DataType.STRING(5000) })
    accessToken!: string;

    @Column({ field: 'refresh_token', type: DataType.STRING(5000) })
    refreshToken!: string;

    @Column({ field: 'expires_at', allowNull: true, type: DataType.DATE })
    expiresAt?: Date;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    authenticator?: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, unique: true, type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User)
    user: User;
}
