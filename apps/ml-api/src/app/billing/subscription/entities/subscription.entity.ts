import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UUIDV4, Optional } from 'sequelize';
import { Plan } from '../../plan/entities/plan.entity';
import { Account } from '../../../accounts/entities/account.entity';

export interface SubscriptionAttributes {
    id: string;
    accountId: string;
    planId: string;
    trialStartTime: Date;
    trialEndTime: Date;
    trialUsed: boolean;
    coupon: string;
    promotionCode: string;
    subscriptionStartTime: Date;
    subscriptionEndTime: Date;
    status: string;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id'> {}

@Table({ tableName: 'subscription', underscored: true, paranoid: true })
export class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> {
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
    account: Account;

    @ForeignKey(() => Plan)
    @Column({ field: 'plan_id', allowNull: false, type: DataType.UUID })
    planId: string;

    @BelongsTo(() => Plan)
    plan: Plan;

    @Column({ field: 'trial_start_time', allowNull: false, type: DataType.DATE })
    trialStartTime: Date;

    @Column({ field: 'trial_end_time', allowNull: false, type: DataType.DATE })
    trialEndTime: Date;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    trialUsed: boolean;

    @Column({ type: DataType.STRING(50), allowNull: true })
    coupon: string;

    @Column({ type: DataType.STRING(50), allowNull: true })
    promotionCode: string;

    @Column({ field: 'sub_start_time', allowNull: false, type: DataType.DATE })
    subscriptionStartTime: Date;

    @Column({ field: 'sub_end_time', allowNull: false, type: DataType.DATE })
    subscriptionEndTime: Date;

    @Column({ field: 'status', allowNull: false, type: DataType.STRING })
    status: string;

    @Column({ field: 'cancel_at_period_end', allowNull: true, type: DataType.BOOLEAN })
    cancelAtPeriodEnd: boolean;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;
}
