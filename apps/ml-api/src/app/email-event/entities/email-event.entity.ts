import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { Category } from '../../category/entities/category.entity';
import { Categories } from '../../category/default-categories';
import { User } from '../../user/entities/user.entity';
import { UserDeviceLink } from '../../user-device-link/entities/user-device-link.entity';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Account } from '../../accounts/entities/account.entity';
import { EmailEventTypes } from '../email-event-types';
import { EmailEventType } from '../../email-event-type/entities/email-event-type.entity';
import { PrrUserAction } from '../../prr-action/prr-action.default';
import { PrrAction } from '../../prr-action/entities/prr-action.entity';
import { Optional } from 'sequelize';

export enum Flag {
    KIND = 'KIND',
    UNKIND = 'UNKIND',
}

export interface EmailEventAttributes {
    id: number;
    eventTypeId: EmailEventTypes;
    eventTime: Date;
    threadId?: string;
    messageId?: string;
    userFlag?: Flag;
    mlFlag?: Flag;
    mlCategory?: Categories;
    prrTriggered?: boolean;
    prrMessage?: string;
    prrAction?: string;
    prrOption?: boolean;
    fromName?: string;
    fromEmail?: string;
    toName?: string;
    toEmail?: string;
    subject?: string;
    body?: string;
    mlVersion?: string;
    browser?: string;
    browserVersion?: string;
    extensionVersion?: string;
    platform?: string;
    googleUserId?: string;
}

export interface EmailEventCreationAttributes extends Optional<EmailEventAttributes, 'id'> {}

@Table({ tableName: 'email_event', updatedAt: false })
export class EmailEvent extends Model<EmailEventAttributes, EmailEventCreationAttributes> {
    @Column({ type: DataType.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ field: 'google_user_id', allowNull: true, type: DataType.STRING(100) })
    googleUserId: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User, 'user_id')
    user?: User;

    @ForeignKey(() => EmailEventType)
    @Column({ field: 'event_type_id', allowNull: false, type: DataType.STRING(50) })
    eventTypeId: EmailEventTypes;

    @BelongsTo(() => EmailEventType)
    eventType?: EmailEventType;

    @Column({ field: 'event_time', allowNull: false, type: DataType.DATE })
    eventTime: Date;

    @Column({ field: 'thread_id', allowNull: true, type: DataType.STRING })
    threadId?: string;

    @Column({ field: 'message_id', allowNull: true, type: DataType.STRING })
    messageId?: string;

    @Column({ field: 'user_flag', allowNull: true, type: DataType.STRING })
    userFlag?: Flag;

    @Column({ field: 'ml_flag', allowNull: true, type: DataType.STRING })
    mlFlag?: Flag;

    @ForeignKey(() => Category)
    @Column({ field: 'ml_category_id', allowNull: true, type: DataType.STRING })
    mlCategoryId?: Categories;

    @BelongsTo(() => Category, 'ml_category_id')
    mlrCategory?: Category;

    @Column({ field: 'prr_triggered', allowNull: true, type: DataType.BOOLEAN })
    prrTriggered?: boolean;

    @Column({ field: 'prr_message', allowNull: true, type: DataType.STRING })
    prrMessage?: string;

    @Column({ field: 'prr_action_id', allowNull: true, type: DataType.STRING(50) })
    prrAction?: PrrUserAction;

    @BelongsTo(() => PrrAction, 'prr_action_id')
    prrActionObj?: PrrAction;

    @Column({ field: 'from_name', allowNull: true, type: DataType.STRING(500) })
    fromName?: string;

    @Column({ field: 'from_email', allowNull: true, type: DataType.STRING(500) })
    fromEmail?: string;

    @Column({ field: 'to_name', allowNull: true, type: DataType.STRING(500) })
    toName?: string;

    @Column({ field: 'to_email', allowNull: true, type: DataType.STRING(500) })
    toEmail?: string;

    @Column({ field: 'subject', allowNull: true, type: DataType.TEXT })
    subject?: string;

    @Column({ field: 'body', allowNull: true, type: DataType.TEXT })
    body?: string;

    @Column({ field: 'ml_version', allowNull: true, type: DataType.STRING })
    mlVersion?: string;

    @Column({ field: 'browser', allowNull: true, type: DataType.STRING })
    browser?: string;

    @Column({ field: 'browser_version', allowNull: true, type: DataType.STRING })
    browserVersion?: string;

    @Column({ field: 'extension_version', allowNull: true, type: DataType.STRING })
    extensionVersion?: string;

    @Column({ field: 'platform', allowNull: true, type: DataType.STRING })
    platform?: string;

    @ForeignKey(() => UserDeviceLink)
    @Column({ field: 'user_device_link_id', allowNull: true, type: DataType.UUID })
    userDeviceLinkId: string;

    @BelongsTo(() => UserDeviceLink)
    userDeviceLink?: UserDeviceLink;

    @ForeignKey(() => OrgUnit)
    @Column({ field: 'org_unit_id', allowNull: true, type: DataType.UUID })
    orgUnitId: string;

    @BelongsTo(() => OrgUnit)
    orgUnit?: OrgUnit;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
}
