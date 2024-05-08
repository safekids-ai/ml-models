import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { PrrTrigger } from '../../prr-trigger/entities/prr-trigger.entity';
import { Category } from '../../category/entities/category.entity';
import { Account } from '../../accounts/entities/account.entity';
import { UserDeviceLink } from '../../user-device-link/entities/user-device-link.entity';
import { Optional } from 'sequelize';

export interface FeedbackAttributes {
    id?: number;
    type: string;
    webUrl: string;
    prrTriggerId?: string;
    prrCategoryId?: string;
    prrImages: object;
    prrTexts: object;
    accountId?: string;
    userDeviceLinkId?: string;
}

interface FeedbackCreationAttributes extends Optional<FeedbackAttributes, 'id'> {}

@Table({ tableName: 'feedback', timestamps: false })
export class Feedback extends Model<FeedbackAttributes, FeedbackCreationAttributes> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id?: number;

    @Column({ field: 'type', type: DataType.STRING })
    type: string;

    @Column({ field: 'web_url', type: DataType.STRING(300) })
    webUrl: string;

    @ForeignKey(() => PrrTrigger)
    @Column({ field: 'prr_trigger_id', allowNull: true, type: DataType.STRING })
    prrTriggerId?: string;

    @BelongsTo(() => PrrTrigger, 'prr_trigger_id')
    prrTrigger?: PrrTrigger;

    @ForeignKey(() => Category)
    @Column({ field: 'prr_category_id', allowNull: true, type: DataType.STRING })
    prrCategoryId?: string;

    @BelongsTo(() => Category, 'prr_category_id')
    prrCategory?: Category;

    @Column({ field: 'prr_images', type: DataType.JSON })
    prrImages: string[];

    @Column({ field: 'prr_texts', type: DataType.JSON })
    prrTexts: string[];

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => UserDeviceLink)
    @Column({ field: 'user_device_link_id', allowNull: false, type: DataType.UUID })
    userDeviceLinkId: string;

    @BelongsTo(() => UserDeviceLink)
    userDeviceLink?: Account;
}
