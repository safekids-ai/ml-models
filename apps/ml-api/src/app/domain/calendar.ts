import { Table, Column, Model, DataType, ForeignKey, Index } from 'sequelize-typescript';

export interface calendarAttributes {
    id?: number;
    year?: number;
    startDate: string;
    endDate: string;
    title?: string;
    accountId: number;
}

@Table({ tableName: 'calendar', timestamps: false })
export class calendar extends Model<calendarAttributes, calendarAttributes> implements calendarAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ allowNull: true, type: DataType.INTEGER })
    year?: number;
    @Column({ field: 'start_date', type: DataType.DATEONLY })
    startDate!: string;
    @Column({ field: 'end_date', type: DataType.DATEONLY })
    endDate!: string;
    @Column({ allowNull: true, type: DataType.STRING(50) })
    title?: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_calendar_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
