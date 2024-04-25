import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../../user/entities/user.entity';
import { Optional, UUIDV4 } from 'sequelize';

export interface NonSchoolDevicesConfigAttributes {
    id: string;
    accountId: string;
    email: string;
}

interface NonSchoolDevicesConfigCreationAttributes extends Optional<NonSchoolDevicesConfigAttributes, 'id'> {}

@Table({ tableName: 'non_school_devices_config', underscored: true, timestamps: false })
export class NonSchoolDevicesConfig extends Model<NonSchoolDevicesConfigAttributes, NonSchoolDevicesConfigCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
    })
    id: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => User)
    @Column({ field: 'email', allowNull: false, type: DataType.STRING })
    email: string;

    @BelongsTo(() => User, { targetKey: 'email' })
    user: User;
}
