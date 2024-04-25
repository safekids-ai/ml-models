import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../../user/entities/user.entity';
import { Device } from '../../device/entities/device.entity';

export interface UserDeviceLinkAttributes {
    id?: string;
    deviceId: string;
    userId: string;
    loginTime?: Date;
    accountId?: string;
    status: string;
}

export interface UserDeviceLinkCreationAttributes extends Optional<UserDeviceLinkAttributes, 'id'> {}

@Table({ tableName: 'user_device_link', paranoid: true })
export class UserDeviceLink extends Model<UserDeviceLinkAttributes, UserDeviceLinkCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id?: string;

    @ForeignKey(() => Device)
    @Column({ field: 'device_id', type: DataType.UUID })
    deviceId!: string;

    @BelongsTo(() => Device)
    device?: Device;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', type: DataType.UUID })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @Column({ field: 'login_time', type: DataType.DATE, defaultValue: new Date() })
    loginTime!: Date;

    @Column({ field: 'last_activity', allowNull: true, type: DataType.DATE, comment: 'not required, we can get from activity table' })
    lastActivity?: Date;

    @Column({ type: DataType.STRING(20) })
    status!: string;

    @Column({ field: 'provision_date', allowNull: true, type: DataType.DATE, defaultValue: new Date() })
    provisionDate?: Date;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;
}
