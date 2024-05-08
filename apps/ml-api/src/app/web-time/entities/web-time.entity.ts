import { BelongsTo, Column, DataType, ForeignKey, Table, Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../../user/entities/user.entity';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Account } from '../../accounts/entities/account.entity';
import { UserDeviceLink } from '../../user-device-link/entities/user-device-link.entity';

export interface WebTimeAttributes {
    id: number;
    userEmail: string;
    userId: string;
    fullUrl?: string;
    hostname?: string;
    visitedAt?: Date;
    deviceId: string;
    userDevicesId: string;
    deviceMacAddress?: string;
    deviceIpAddress?: string;
    devicePublicWan?: string;
    extensionVersion?: string;
    browserVersion?: string;
    browser?: string;
    ip?: string;
    location?: string;
    userDeviceLinkId?: string;
    orgUnitId: string;
    accountId: string;
    duration?: number;
}

export interface WebTimeCreationAttributes extends Optional<WebTimeAttributes, 'id'> {}

@Table({ tableName: 'web_time', timestamps: false })
export class WebTime extends Model<WebTimeAttributes, WebTimeCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.BIGINT, autoIncrement: true })
    id!: number;

    @Column({ field: 'user_email', type: DataType.STRING(150) })
    userEmail!: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: true, type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User, 'user_id')
    user?: User;

    @Column({ field: 'full_url', allowNull: true, type: DataType.STRING(45) })
    fullUrl?: string;

    @Column({ field: 'host_name', allowNull: true, type: DataType.STRING(45) })
    hostname?: string;

    @Column({ field: 'visited_at', allowNull: true, type: DataType.DATE })
    visitedAt?: Date;

    @Column({ field: 'duration', allowNull: true, type: DataType.INTEGER })
    duration?: number;

    @Column({ field: 'device_id', type: DataType.UUID })
    deviceId: string;

    @Column({ field: 'user_devices_id', type: DataType.UUID })
    userDevicesId!: string;

    @Column({ field: 'device_mac_address', allowNull: true, type: DataType.STRING(100) })
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

    @Column({ field: 'ml_version', allowNull: true, type: DataType.STRING(45) })
    mlVersion?: string;

    @Column({ field: 'nlp_version', allowNull: true, type: DataType.STRING(45) })
    nlpVersion?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    ip?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    location?: string;

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
}
