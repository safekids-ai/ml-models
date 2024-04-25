import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { PrrUserAction } from '../../prr-action/prr-action.default';
import { PrrAction } from '../../prr-action/entities/prr-action.entity';
import { EmailEventType } from '../../email-event-type/entities/email-event-type.entity';
import { EmailEventTypes } from '../../email-event/email-event-types';
import { Optional } from 'sequelize';

export interface EmailEventConfigAttributes {
    id: number;
    enabled?: boolean;
    prrActionId?: PrrUserAction;
    eventTypeId?: EmailEventTypes;
    accountId?: string;
    emailRecipients?: string;
}

interface EmailEventConfigCreationAttributes extends Optional<EmailEventConfigAttributes, 'id'> {}

@Table({ tableName: 'email_event_config', updatedAt: false, createdAt: false })
export class EmailEventConfig extends Model<EmailEventConfigAttributes, EmailEventConfigCreationAttributes> {
    @Column({ type: DataType.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => EmailEventType)
    @Column({ field: 'event_type_id', allowNull: false, type: DataType.STRING(50) })
    eventTypeId: EmailEventTypes;

    @BelongsTo(() => EmailEventType)
    eventType?: EmailEventType;

    @Column({ field: 'prr_action_id', allowNull: true, type: DataType.STRING(50) })
    prrActionId?: PrrUserAction;

    @BelongsTo(() => PrrAction, 'prr_action_id')
    prrActionObj?: PrrAction;

    @Column({ allowNull: false, type: DataType.TINYINT, defaultValue: true })
    enabled: boolean;

    @Column({ field: 'email_recipients', allowNull: true, type: DataType.STRING(1000) })
    emailRecipients: string;
}
