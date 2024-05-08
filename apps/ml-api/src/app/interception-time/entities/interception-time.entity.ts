import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { Status } from '../../status/entities/status.entity';
import { Optional } from 'sequelize';

export interface InterceptionTimeAttributes {
    id: number;
    schoolStartTime?: string;
    schoolEndTime?: string;
    lightOffStartTime?: string;
    lightOffEndTime?: string;
    accountId?: string;
    statusId?: string;
}

export interface InterceptionTimeCreationAttributes extends Optional<InterceptionTimeAttributes, 'id'> {}

@Table({ tableName: 'interception_time', timestamps: false, underscored: true })
export class InterceptionTime extends Model<InterceptionTimeAttributes, InterceptionTimeCreationAttributes> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id: number;

    @Column({ field: 'school_start_time', type: DataType.TIME, allowNull: false })
    schoolStartTime!: string;

    @Column({ field: 'school_end_time', type: DataType.TIME, allowNull: false })
    schoolEndTime!: string;

    @Column({ field: 'lightsoff_start_time', type: DataType.TIME, allowNull: false })
    lightOffStartTime!: string;

    @Column({ field: 'lightsoff_end_time', type: DataType.TIME, allowNull: false })
    lightOffEndTime!: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    @BelongsTo(() => Status)
    status: Status;
}
