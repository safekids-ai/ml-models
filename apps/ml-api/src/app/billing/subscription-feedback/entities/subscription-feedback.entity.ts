import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../../accounts/entities/account.entity';
import { Optional, UUIDV4 } from 'sequelize';

export interface SubscriptionFeedbackAttributes {
    id: string;
    feedback: string[];
    accountId: string;
    account?: Account;
}

interface SubscriptionFeedbackCreationAttributes extends Optional<SubscriptionFeedbackAttributes, 'id'> {}

@Table({ tableName: 'subscription-feedback', paranoid: true })
export class SubscriptionFeedback extends Model<SubscriptionFeedbackAttributes, SubscriptionFeedbackCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({ field: 'feedback', allowNull: false, type: DataType.JSON })
    feedback: string[];

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;
}
