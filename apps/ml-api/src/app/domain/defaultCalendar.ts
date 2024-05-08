import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface defaultCalendarAttributes {
    id?: number;
    year?: number;
    startDate: string;
    endDate: string;
    title?: string;
}

@Table({ tableName: 'default_calendar', timestamps: false })
export class defaultCalendar extends Model<defaultCalendarAttributes, defaultCalendarAttributes> implements defaultCalendarAttributes {
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
}
