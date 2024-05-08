import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Activity } from '../../activity/entities/activity.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Optional } from 'sequelize';

export interface PrrNotificationAttributes {
    accountId: string;
    activityId: number;
    contact: string;
    expired?: boolean;
    expiredAt?: Date;
    expiryDate?: Date;
    id?: string;
    phoneNumber: string;
    read?: boolean;
    readAt?: Date;
    url: string;
}

interface PrrNotificationCreationAttributes extends Optional<PrrNotificationAttributes, 'id'> {}

@Table({ tableName: 'prr_notification', paranoid: true })
export class PrrNotification extends Model<PrrNotificationAttributes, PrrNotificationCreationAttributes> {
    @Column({ field: 'id', primaryKey: true, allowNull: false, type: DataType.UUID })
    id: string;

    @ForeignKey(() => Activity)
    @Column({ field: 'activity_id', allowNull: false, type: DataType.BIGINT })
    activityId: number;

    @BelongsTo(() => Activity)
    activity?: Activity;

    @Column({ field: 'url', allowNull: false, type: DataType.STRING(300) })
    url: string;

    @Column({ field: 'read', allowNull: false, type: DataType.BOOLEAN, defaultValue: false })
    read: boolean;

    @Column({ field: 'read_at', allowNull: true, type: DataType.DATE })
    readAt: Date;

    @Column({ field: 'contact', allowNull: false, type: DataType.STRING })
    contact: string;

    @Column({ field: 'phone_number', allowNull: true, type: DataType.STRING })
    phoneNumber: string;

    @Column({ field: 'expired', allowNull: false, type: DataType.BOOLEAN, defaultValue: false })
    expired: boolean;

    @Column({ field: 'expired_at', allowNull: true, type: DataType.DATE })
    expiredAt: Date;

    @Column({ field: 'expiry_date', allowNull: true, type: DataType.DATE })
    expiryDate: Date;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;
}
