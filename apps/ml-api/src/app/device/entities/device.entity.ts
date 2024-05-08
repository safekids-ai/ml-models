import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { Status } from '../../status/entities/status.entity';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Optional } from 'sequelize';

export interface DeviceAttributes {
    id?: string;
    name: string;
    os?: string;
    schoolsId?: number;
    serialNumber?: string;
    deviceTypeId: string;
    cpuModel?: string;
    wifiMac?: string;
    ethernetMac?: string;
    imei?: string;
    osVersion?: string;
    platformVersion?: string;
    directoryApiId?: string;
    accountId?: string;
    orgUnitId?: string;
    statusId?: string;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id'> {}

@Table({ tableName: 'device' })
export class Device extends Model<DeviceAttributes, DeviceCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string;

    @Column({ type: DataType.STRING(200) })
    name!: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    os?: string;

    @Column({ field: 'schools_id', type: DataType.BIGINT })
    schoolsId!: number;

    @Column({ field: 'device_id', type: DataType.STRING(100) })
    deviceId!: string;

    @Column({ field: 'serial_number', type: DataType.STRING(100) })
    serialNumber!: string;

    @Column({ field: 'device_type_id', type: DataType.STRING })
    deviceTypeId!: string;

    @Column({ field: 'cpu_model', allowNull: true, type: DataType.STRING(50) })
    cpuModel?: string;

    @Column({ field: 'wifi_mac', allowNull: true, type: DataType.STRING(45) })
    wifiMac?: string;

    @Column({ field: 'ethernet_mac', allowNull: true, type: DataType.STRING(45) })
    ethernetMac?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    imei?: string;

    @Column({ field: 'os_version', allowNull: true, type: DataType.STRING(45) })
    osVersion?: string;

    @Column({ field: 'platform_version', allowNull: true, type: DataType.STRING(45) })
    platformVersion?: string;

    @Column({ field: 'directory_api_id', allowNull: true, unique: true, type: DataType.STRING(100) })
    directoryApiId?: string;

    @ForeignKey(() => OrgUnit)
    @Column({ field: 'org_unit_id', allowNull: false, type: DataType.UUID })
    orgUnitId: string;

    @BelongsTo(() => OrgUnit)
    orgUnit: OrgUnit;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    @BelongsTo(() => Status)
    status: Status;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;
}
