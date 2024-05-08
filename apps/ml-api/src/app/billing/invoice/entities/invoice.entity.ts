import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { Account } from '../../../accounts/entities/account.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';

export interface InvoiceAttributes {
    id: string;
    accountId: string;
    subscriptionId: string;
    nextPaymentDate: Date;
    totalPrice: string;
    afterPromo: string;
    amountPaid: string;
    amountDue: string;
    amountRemaining: string;
}

export interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id'> {}

@Table({ tableName: 'invoice' })
export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID, unique: true })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => Subscription)
    @Column({ field: 'subscription_id', allowNull: false, type: DataType.UUID, unique: true })
    subscriptionId: string;

    @BelongsTo(() => Subscription)
    subscription?: Subscription;

    @Column({ field: 'next_payment_date', type: DataType.DATE })
    nextPaymentDate: Date;

    @Column({ field: 'total_price', type: DataType.STRING })
    totalPrice: string;

    @Column({ field: 'after_promo', type: DataType.STRING })
    afterPromo: string;

    @Column({ field: 'amount_paid', type: DataType.STRING })
    amountPaid: string;

    @Column({ field: 'amount_due', type: DataType.STRING })
    amountDue: string;

    @Column({ field: 'amount_remaining', type: DataType.STRING })
    amountRemaining: string;
}
