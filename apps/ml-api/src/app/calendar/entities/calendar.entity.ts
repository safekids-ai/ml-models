import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Account } from '../../accounts/entities/account.entity';
import { Status } from '../../status/entities/status.entity';
import { Statuses } from '../../status/default-status';

export interface CalendarAttributes {
    id?: number;
    year?: number;
    startDate: string;
    endDate: string;
    title?: string;
    accountId: string;
    statusId?: string;
}

interface CalendarCreationAttributes extends Optional<CalendarAttributes, 'id'> {}

@Table({ tableName: 'nonschool_day', timestamps: false })
export class AccountCalendar extends Model<CalendarAttributes, CalendarCreationAttributes> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ field: 'start_date', type: DataType.DATEONLY })
    startDate!: string;

    @Column({ field: 'end_date', type: DataType.DATEONLY })
    endDate!: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    title?: string;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    type?: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: true, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: false, defaultValue: Statuses.ACTIVE })
    statusId?: string;

    @BelongsTo(() => Status)
    status: Status;
}
