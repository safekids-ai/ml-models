import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { Account } from '../../../accounts/entities/account.entity';

export interface PromoCodeAttributes {
    id: string;
    code: string;
    apiKey: string;
    coupon: string;
    stripeCustomerId: string;
    expiresAt: Date;
    active: boolean;
    accountId: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    times_redeemed: number;
}

interface PromoCodeCreationAttributes extends Optional<PromoCodeAttributes, 'id'> {}

@Table({ tableName: 'referral_promo_code', underscored: true, paranoid: true })
export class PromoCode extends Model<PromoCodeAttributes, PromoCodeCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING(8), allowNull: false, unique: true })
    code: string;

    @Column({ field: 'api_key', type: DataType.STRING, allowNull: false, unique: true })
    apiKey: string;

    @Column({ type: DataType.STRING, allowNull: false })
    coupon: string;

    @Column({ field: 'stripe_customer_id', type: DataType.STRING(150), allowNull: false })
    stripeCustomerId: string;

    @Column({ field: 'expires_at', type: DataType.DATE, allowNull: true })
    expiresAt: Date;

    @Column({ field: 'active', type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    active: boolean;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'created_by', type: DataType.STRING })
    createdBy!: string;

    @Column({ field: 'updated_by', type: DataType.STRING })
    updatedBy!: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'times_redeemed', type: DataType.INTEGER, allowNull: false })
    times_redeemed: number;
}
