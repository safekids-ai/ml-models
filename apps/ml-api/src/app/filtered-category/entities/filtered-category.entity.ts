import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Category } from '../../category/entities/category.entity';
import { Account } from '../../accounts/entities/account.entity';
import { CategoryStatus } from '../../category/category.status';

export interface FilteredCategoryAttributes {
    id: string;
    name: string;
    enabled: boolean;
    categoryId: string;
    orgUnitId: string;
    orgUnit?: OrgUnit;
    accountId: string;
    status: CategoryStatus;
    timeDuration: number;
}

interface FilteredCategoryCreationAttributes extends Optional<FilteredCategoryAttributes, 'id'> {}

@Table({ tableName: 'filtered_category', timestamps: false })
export class FilteredCategory extends Model<FilteredCategoryAttributes, FilteredCategoryCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue: UUIDV4 })
    id: string;

    @Column({ allowNull: false, type: DataType.STRING(40) })
    name: string;

    @Column({ allowNull: false, type: DataType.TINYINT })
    enabled: boolean;

    @ForeignKey(() => Category)
    @Column({ field: 'category_id', allowNull: false, type: DataType.STRING })
    categoryId: string;

    @BelongsTo(() => Category)
    category?: Category;

    @ForeignKey(() => OrgUnit)
    @Column({ field: 'org_unit_id', allowNull: false, type: DataType.UUID })
    orgUnitId: string;

    @BelongsTo(() => OrgUnit)
    orgUnit?: OrgUnit;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;

    @Column({ field: 'status', type: DataType.STRING(50), allowNull: false })
    status: CategoryStatus;

    @Column({ field: 'time_duration', type: DataType.INTEGER, allowNull: true })
    timeDuration: number;
}
