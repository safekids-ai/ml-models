import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface userDeviceAttributes {
    id?: number;
    devicesId: number;
    usersId: number;
    loginTime: Date;
    lastActivity?: Date;
    status: string;
    provisionDate?: Date;
}

@Table({ tableName: 'user_device', timestamps: false })
export class userDevice extends Model<userDeviceAttributes, userDeviceAttributes> implements userDeviceAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'devices_id', type: DataType.BIGINT })
    @Index({ name: 'fk_userDevices_devices1_idx', using: 'BTREE', order: 'ASC', unique: false })
    devicesId!: number;
    @Column({ field: 'users_id', type: DataType.BIGINT })
    @Index({ name: 'fk_userDevices_users1_idx', using: 'BTREE', order: 'ASC', unique: false })
    usersId!: number;
    @Column({ field: 'login_time', type: DataType.DATE })
    loginTime!: Date;
    @Column({ field: 'last_activity', allowNull: true, type: DataType.DATE, comment: 'not required, we can get from activity table' })
    lastActivity?: Date;
    @Column({ type: DataType.STRING(20) })
    status!: string;
    @Column({ field: 'provision_date', allowNull: true, type: DataType.DATE })
    provisionDate?: Date;
}
