import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { User } from '../../user/entities/user.entity';
import { Status } from '../../status/entities/status.entity';
import { Category } from '../../category/entities/category.entity';
import { ActivityType } from '../../activity-type/entities/activity-type.entity';
import { PrrTrigger } from '../../prr-trigger/entities/prr-trigger.entity';
import { PrrLevel } from '../../prr-level/entities/prr-level.entity';
import { UserDeviceLink } from '../../user-device-link/entities/user-device-link.entity';
import { Categories } from '../../category/default-categories';
import { Statuses } from '../../status/default-status';
import { PrrTriggers } from '../../prr-trigger/prr-triggers,default';
import { ActivityTypes } from '../../activity-type/default-activitytypes';
import { PrrLevels } from '../../prr-level/prr-level.default';
import { Optional } from 'sequelize';

export interface PrrMessage {
    query: string;
    responses: string[];
}

export interface ActivityAttributes {
    id: number,
    userEmail?: string;
    teacherName?: string;
    activityTime?: Date;
    prrImages?: string[];
    prrTexts?: string[];
    prrMessages?: PrrMessage[];
    prrLevelId?: PrrLevels;
    prrTriggerId?: PrrTriggers;
    prrCategoryId?: Categories;
    prrActivityTypeId?: ActivityTypes;
    webActivityTypeId?: ActivityTypes;
    webUrl?: string;
    webTitle?: string;
    fullWebUrl?: string;
    deviceMacAddress?: string;
    deviceIpAddress?: string;
    devicePublicWan?: string;
    accessLimited?: number;
    location?: string;
    appName?: string;
    os?: string;
    extensionVersion?: string;
    mlVersion?: string;
    nlpVersion?: string;
    browserVersion?: string;
    browser?: string;
    ip?: string;
    webCategoryId?: Categories;
    schoolName?: string;
    statusId?: Statuses;
    userDeviceLinkId?: string;
    userId?: string;
    teacherId?: string;
    orgUnitId?: string;
    accountId?: string;
    eventId?: string;
    userName: string;
}

export interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id'> {}

@Table({ tableName: 'activity', updatedAt: false })
export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> {
    @Column({ type: DataType.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ field: 'user_email', allowNull: false, type: DataType.STRING(100) })
    userEmail!: string;

    @Column({ field: 'user_name', allowNull: false, type: DataType.STRING(100) })
    userName!: string;

    @Column({ field: 'teacher_name', allowNull: true, type: DataType.STRING(100) })
    teacherName?: string;

    @Column({ field: 'activity_time', allowNull: false, type: DataType.DATE })
    activityTime!: Date;

    @Column({ field: 'prr_images', allowNull: true, type: DataType.JSON })
    prrImages?: string[];

    @Column({ field: 'prr_texts', allowNull: true, type: DataType.JSON })
    prrTexts?: string[];

    @Column({ field: 'prr_messages', allowNull: true, type: DataType.JSON, comment: 'array of messages and responses by user' })
    prrMessages?: PrrMessage[];

    @ForeignKey(() => PrrLevel)
    @Column({ field: 'prr_level_id', allowNull: true, type: DataType.STRING })
    prrLevelId?: PrrLevels;

    @BelongsTo(() => PrrLevel, 'prr_level_id')
    prrLevel?: PrrLevel;

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

    @ForeignKey(() => ActivityType)
    @Column({ field: 'prr_activity_type_id', allowNull: true, type: DataType.STRING })
    prrActivityTypeId: ActivityTypes;

    @BelongsTo(() => ActivityType, 'prr_activity_type_id')
    pprActivityType?: ActivityType;

    @ForeignKey(() => ActivityType)
    @Column({ field: 'web_activity_type_id', allowNull: false, type: DataType.STRING, defaultValue: ActivityTypes.PAGE_VISIT })
    webActivityTypeId: ActivityTypes;

    @BelongsTo(() => ActivityType, 'web_activity_type_id')
    webActivityType?: ActivityType;

    @Column({ field: 'web_url', allowNull: false, type: DataType.STRING(250) })
    webUrl?: string;

    @Column({ field: 'web_title', allowNull: true, type: DataType.STRING(100) })
    webTitle?: string;

    @Column({ field: 'full_web_url', allowNull: true, type: DataType.STRING(1000) })
    fullWebUrl?: string;

    @Column({ field: 'device_mac_address', allowNull: true, type: DataType.STRING(50) })
    deviceMacAddress?: string;

    @Column({ field: 'device_ip_address', allowNull: true, type: DataType.STRING(50) })
    deviceIpAddress?: string;

    @Column({ field: 'device_public_wan', allowNull: true, type: DataType.STRING(50) })
    devicePublicWan?: string;

    @Column({ field: 'access_limited', allowNull: true, type: DataType.TINYINT })
    accessLimited?: number;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    location?: string;

    @Column({ field: 'app_name', allowNull: true, type: DataType.STRING(45) })
    appName?: string;

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

    @Column({ allowNull: true, type: DataType.STRING(45) })
    ip?: string;

    @ForeignKey(() => Category)
    @Column({ field: 'web_category_id', allowNull: true, type: DataType.STRING, defaultValue: Categories.PERMISSIBLE })
    webCategoryId: Categories;

    @BelongsTo(() => Category, 'web_category_id')
    webCategory?: Category;

    @Column({
        field: 'event_id',
        allowNull: true,
        type: DataType.STRING(50),
        unique: true,
        set(val) {
            if (val === '') {
                this.setDataValue('eventId', null);
                return;
            }
            this.setDataValue('eventId', val);
            return;
        },
    })
    eventId: string;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', allowNull: false, type: DataType.STRING, defaultValue: Statuses.ACTIVE })
    statusId: Statuses;

    @BelongsTo(() => Status, 'status_id')
    status?: Status;

    @Column({ field: 'is_offday', allowNull: true, type: DataType.BOOLEAN })
    isOffDay?: boolean;

    @Column({ field: 'is_offtime', allowNull: true, type: DataType.BOOLEAN })
    isOffTime?: boolean;

    @Column({ field: 'school_name', allowNull: true, type: DataType.STRING(100) })
    schoolName?: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: true, type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User, 'user_id')
    user?: User;

    @ForeignKey(() => User)
    @Column({ field: 'teacher_id', allowNull: true, type: DataType.UUID })
    teacherId: string;

    @BelongsTo(() => User, 'teacher_id')
    teacher?: User;

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
