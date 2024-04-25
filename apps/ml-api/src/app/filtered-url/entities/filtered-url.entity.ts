import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Account } from '../../accounts/entities/account.entity';

export interface FilteredUrlAttributes {
    id?: string;
    url: string;
    orgUnitId?: string;
    accountId: string;
    enabled: boolean;
    inheritFromParent: boolean;
}

export interface FilteredUrlCreationAttributes extends Optional<FilteredUrlAttributes, 'id'> {}

@Table({ tableName: 'filtered_url', timestamps: false })
export class FilteredUrl extends Model<FilteredUrlAttributes, FilteredUrlCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue: UUIDV4 })
    id?: string;

    @Column({ allowNull: false, type: DataType.STRING(150) })
    url!: string;

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

    @Column({ field: 'enabled', allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    enabled: boolean;

    @Column({ field: 'inherit_from_parent', allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    inheritFromParent: boolean;
}
