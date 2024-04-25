import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { PrrTriggers } from '../../prr-trigger/prr-triggers,default';
import { Categories } from '../../category/default-categories';
import { Category } from '../../category/entities/category.entity';
import { PrrTrigger } from '../../prr-trigger/entities/prr-trigger.entity';
import { Optional } from 'sequelize';

export interface ActivityAiDataAttributes {
    id: number;
    webUrl?: string;
    fullWebUrl?: string;
    prrImages?: string[];
    prrTexts?: string[];
    prrTriggerId?: PrrTriggers;
    prrCategoryId?: Categories;
    activityTime?: Date;
    falsePositive?: boolean;
    os?: string;
    extensionVersion?: string;
    mlVersion?: string;
    nlpVersion?: string;
    browserVersion?: string;
    browser?: string;
    ip?: string;
}

export interface ActivityAiDataCreationAttributes extends Optional<ActivityAiDataAttributes, 'id'> {}

@Table({ tableName: 'activity_ai_data', updatedAt: false })
export class ActivityAiDatum extends Model<ActivityAiDataAttributes, ActivityAiDataCreationAttributes> {
    @Column({ type: DataType.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ field: 'web_url', allowNull: false, type: DataType.STRING(250) })
    webUrl?: string;

    @Column({ field: 'full_web_url', allowNull: true, type: DataType.STRING(1000) })
    fullWebUrl?: string;

    @Column({ field: 'prr_images', allowNull: true, type: DataType.JSON })
    prrImages?: string[];

    @Column({ field: 'prr_texts', allowNull: true, type: DataType.JSON })
    prrTexts?: string[];

    @ForeignKey(() => PrrTrigger)
    @Column({ field: 'prr_trigger_id', allowNull: true, type: DataType.STRING })
    prrTriggerId?: PrrTriggers;

    @BelongsTo(() => PrrTrigger, 'prr_trigger_id')
    prrTrigger?: PrrTrigger;

    @ForeignKey(() => Category)
    @Column({ field: 'prr_category_id', allowNull: true, type: DataType.STRING })
    prrCategoryId?: Categories;

    @BelongsTo(() => Category, 'prr_category_id')
    prrCategory?: Category;

    @Column({ field: 'activity_time', allowNull: false, type: DataType.DATE })
    activityTime!: Date;

    @Column({ field: 'false_positive', allowNull: false, type: DataType.BOOLEAN, defaultValue: false })
    falsePositive: boolean;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    os?: string;

    @Column({ field: 'extension_version', allowNull: true, type: DataType.STRING(45) })
    extensionVersion?: string;

    @Column({ field: 'ml_version', allowNull: true, type: DataType.STRING(45) })
    mlVersion?: string;

    @Column({ field: 'nlp_version', allowNull: true, type: DataType.STRING(45) })
    nlpVersion?: string;

    @Column({ field: 'browser_version', allowNull: true, type: DataType.STRING(45) })
    browserVersion?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    browser?: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
}
