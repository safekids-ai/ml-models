import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Account } from '../../accounts/entities/account.entity';

export interface FilteredProcessAttributes {
    id?: string;
    name: string;
    orgUnitId?: string;
    accountId: string;
    isAllowed: boolean;
}

export interface FilteredProcessCreationAttributes extends Optional<FilteredProcessAttributes, 'id'> {}

@Table({ tableName: 'filtered_process', paranoid: true })
export class FilteredProcess extends Model<FilteredProcessAttributes, FilteredProcessCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue: UUIDV4 })
    id?: string;

    @Column({ allowNull: false, type: DataType.STRING(150) })
    name!: string;

    @ForeignKey(() => OrgUnit)
    @Column({ field: 'org_unit_id', allowNull: true, type: DataType.UUID })
    orgUnitId: string;

    @BelongsTo(() => OrgUnit)
    orgUnit?: OrgUnit;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;

    @Column({ field: 'is_allowed', allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    isAllowed: boolean;
}
