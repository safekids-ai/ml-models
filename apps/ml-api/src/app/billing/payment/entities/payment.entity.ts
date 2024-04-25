import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { Account } from '../../../accounts/entities/account.entity';

export interface PaymentAttributes {
    id: string;
    accountId: string;
    paymentMethodId: string;
    lastDigits: string;
    expiryMonth: number;
    expiryYear: number;
    createdAt: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

@Table({ tableName: 'payment', underscored: true, paranoid: true })
export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;

    @Column({ field: 'payment_method_id', allowNull: false, type: DataType.STRING, unique: true })
    paymentMethodId: string;

    @Column({ field: 'last_digits', allowNull: false, type: DataType.STRING })
    lastDigits: string;

    @Column({ field: 'expiry_month', allowNull: false, type: DataType.INTEGER })
    expiryMonth: number;

    @Column({ field: 'expiry_year', allowNull: false, type: DataType.INTEGER })
    expiryYear: number;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
}
