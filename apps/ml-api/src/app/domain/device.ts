import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface deviceAttributes {
    id: number;
    name: string;
    os?: string;
    schoolsId: number;
    deviceId: string;
    serialNumber: string;
    deviceTypeId: number;
    cpuModel?: string;
    wifiMac?: string;
    ethernetMac?: string;
    imei?: string;
    osVersion?: string;
    paltformVersion?: string;
    directoryApiId?: string;
    orgunitId: number;
    statusId: number;
}

@Table({ tableName: 'device', timestamps: false })
export class device extends Model<deviceAttributes, deviceAttributes> implements deviceAttributes {
    @Column({ primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'id_UNIQUE', using: 'BTREE', order: 'ASC', unique: true })
    id!: number;
    @Column({ type: DataType.STRING(45) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    os?: string;
    @Column({ field: 'schools_id', type: DataType.BIGINT })
    schoolsId!: number;
    @Column({ field: 'device_id', type: DataType.STRING(50) })
    deviceId!: string;
    @Column({ field: 'serial_number', type: DataType.STRING(45) })
    serialNumber!: string;
    @Column({ field: 'device_type_id', primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_devices_device_types1_idx', using: 'BTREE', order: 'ASC', unique: false })
    deviceTypeId!: number;
    @Column({ field: 'cpu_model', allowNull: true, type: DataType.STRING(45) })
    cpuModel?: string;
    @Column({ field: 'wifi_mac', allowNull: true, type: DataType.STRING(45) })
    wifiMac?: string;
    @Column({ field: 'ethernet_mac', allowNull: true, type: DataType.STRING(45) })
    ethernetMac?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    imei?: string;
    @Column({ field: 'os_version', allowNull: true, type: DataType.STRING(45) })
    osVersion?: string;
    @Column({ field: 'paltform_version', allowNull: true, type: DataType.STRING(45) })
    paltformVersion?: string;
    @Column({ field: 'directory_api_id', allowNull: true, type: DataType.STRING(45) })
    directoryApiId?: string;
    @Column({ field: 'orgunit_id', primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_device_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgunitId!: number;
    @Column({ field: 'status_id', primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_device_status1_idx', using: 'BTREE', order: 'ASC', unique: false })
    statusId!: number;
}
