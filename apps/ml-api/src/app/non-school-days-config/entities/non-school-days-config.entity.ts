import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
export interface NonSchoolDaysConfigAttributes {
    accountId: string;
    weekendsEnabled: boolean;
    publicHolidaysEnabled: boolean;
}

export interface NonSchoolDaysConfigCreationAttributes extends NonSchoolDaysConfigAttributes {}

@Table({ tableName: 'nonschool_days_config', underscored: true })
export class NonSchoolDaysConfig extends Model<NonSchoolDaysConfigAttributes, NonSchoolDaysConfigCreationAttributes> {
    @ForeignKey(() => Account)
    @Column({ primaryKey: true, field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'weekends_enabled', allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    weekendsEnabled: boolean;

    @Column({ field: 'public_holidays_enabled', allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    publicHolidaysEnabled: boolean;
}
