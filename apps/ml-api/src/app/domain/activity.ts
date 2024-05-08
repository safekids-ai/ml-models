import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface activityAttributes {
    id: number;
    userEmail: string;
    teacherName?: string;
    activityTime: Date;
    prrImages?: object;
    prrTexts?: object;
    prrMessages?: object;
    prrLevelId: number;
    prrTriggerId: number;
    prrCategoryId: number;
    prrActivityTypeId: number;
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
    webCategoryId: number;
    statusId: number;
    userId: number;
    teacherId: number;
    orgUnitId: number;
    createdAt: Date;
    accountId: number;
}

@Table({ tableName: 'activity', timestamps: false })
export class activity extends Model<activityAttributes, activityAttributes> implements activityAttributes {
    @Column({ primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id!: number;
    @Column({ field: 'user_email', type: DataType.STRING(100) })
    userEmail!: string;
    @Column({ field: 'teacher_name', allowNull: true, type: DataType.STRING(100) })
    teacherName?: string;
    @Column({ field: 'activity_time', type: DataType.DATE })
    activityTime!: Date;
    @Column({ field: 'prr_images', allowNull: true, type: DataType.JSON })
    prrImages?: object;
    @Column({ field: 'prr_texts', allowNull: true, type: DataType.JSON })
    prrTexts?: object;
    @Column({ field: 'prr_messages', allowNull: true, type: DataType.JSON, comment: 'array of messages and responses by user' })
    prrMessages?: object;
    @Column({ field: 'prr_level_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_prr_level1_idx', using: 'BTREE', order: 'ASC', unique: false })
    prrLevelId!: number;
    @Column({ field: 'prr_trigger_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_prr_trigger1_idx', using: 'BTREE', order: 'ASC', unique: false })
    prrTriggerId!: number;
    @Column({ field: 'prr_category_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_prr_category1_idx', using: 'BTREE', order: 'ASC', unique: false })
    prrCategoryId!: number;
    @Column({ field: 'prr_activity_type_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_prr_activity_type1_idx', using: 'BTREE', order: 'ASC', unique: false })
    prrActivityTypeId!: number;
    @Column({ field: 'web_url', allowNull: true, type: DataType.STRING(45) })
    webUrl?: string;
    @Column({ field: 'web_title', allowNull: true, type: DataType.STRING(45) })
    webTitle?: string;
    @Column({ field: 'full_web_url', allowNull: true, type: DataType.STRING(300) })
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
    @Column({ field: 'web_category_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_category1_idx', using: 'BTREE', order: 'ASC', unique: false })
    webCategoryId!: number;
    @Column({ field: 'status_id', type: DataType.INTEGER })
    @Index({ name: 'fk_activity_status1_idx', using: 'BTREE', order: 'ASC', unique: false })
    statusId!: number;
    @Column({ field: 'user_id', type: DataType.BIGINT })
    @Index({ name: 'fk_activity_user1_idx', using: 'BTREE', order: 'ASC', unique: false })
    userId!: number;
    @Column({ field: 'teacher_id', type: DataType.BIGINT })
    @Index({ name: 'fk_activity_user2_idx', using: 'BTREE', order: 'ASC', unique: false })
    teacherId!: number;
    @Column({ field: 'org_unit_id', type: DataType.BIGINT })
    @Index({ name: 'fk_activity_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgUnitId!: number;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_activity_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
