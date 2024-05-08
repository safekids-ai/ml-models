import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface webUsageAttributes {
    id: number;
    userEmail: string;
    userId: number;
    fullUrl?: string;
    hostname?: string;
    visitedAt?: Date;
    teacherName?: string;
    teacherId?: number;
    deviceId: number;
    userDevicesId: number;
    deviceMacAddress?: string;
    deviceIpAddress?: string;
    devicePublicWan?: string;
    extensionVersion?: string;
    browserVersion?: string;
    browser?: string;
    ip?: string;
    location?: string;
    createdAt: Date;
    organizationUnitId: number;
    accountId: number;
}

@Table({ tableName: 'web_usage', timestamps: false })
export class webUsage extends Model<webUsageAttributes, webUsageAttributes> implements webUsageAttributes {
    @Column({ primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id!: number;
    @Column({ field: 'user_email', type: DataType.STRING(100) })
    userEmail!: string;
    @Column({ field: 'user_id', type: DataType.BIGINT })
    userId!: number;
    @Column({ field: 'full_url', allowNull: true, type: DataType.STRING(45) })
    fullUrl?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    hostname?: string;
    @Column({ field: 'visited_at', allowNull: true, type: DataType.DATE })
    visitedAt?: Date;
    @Column({ field: 'teacher_name', allowNull: true, type: DataType.STRING(100) })
    teacherName?: string;
    @Column({ field: 'teacher_id', allowNull: true, type: DataType.BIGINT })
    teacherId?: number;
    @Column({ field: 'device_id', type: DataType.BIGINT })
    deviceId!: number;
    @Column({ field: 'user_devices_id', type: DataType.BIGINT })
    userDevicesId!: number;
    @Column({ field: 'device_mac_address', allowNull: true, type: DataType.STRING(50) })
    deviceMacAddress?: string;
    @Column({ field: 'device_ip_address', allowNull: true, type: DataType.STRING(50) })
    deviceIpAddress?: string;
    @Column({ field: 'device_public_wan', allowNull: true, type: DataType.STRING(50) })
    devicePublicWan?: string;
    @Column({ field: 'extension_version', allowNull: true, type: DataType.STRING(45) })
    extensionVersion?: string;
    @Column({ field: 'browser_version', allowNull: true, type: DataType.STRING(45) })
    browserVersion?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    browser?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    ip?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    location?: string;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'organization_unit_id', type: DataType.BIGINT })
    @Index({ name: 'fk_web_usage_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    organizationUnitId!: number;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_web_usage_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
