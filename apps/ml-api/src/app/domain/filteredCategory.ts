import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface filteredCategoryAttributes {
    id?: number;
    category: string;
    orgUnitId: number;
    enabled?: number;
    inheritFromParent?: number;
    categoryId: number;
    accountId: number;
}

@Table({ tableName: 'filtered_category', timestamps: false })
export class filteredCategory extends Model<filteredCategoryAttributes, filteredCategoryAttributes> implements filteredCategoryAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(40) })
    category!: string;
    @Column({ field: 'org_unit_id', type: DataType.BIGINT })
    @Index({ name: 'fk_filtered_category_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgUnitId!: number;
    @Column({ allowNull: true, type: DataType.TINYINT })
    enabled?: number;
    @Column({ field: 'inherit_from_parent', allowNull: true, type: DataType.TINYINT })
    inheritFromParent?: number;
    @Column({ field: 'category_id', type: DataType.INTEGER })
    @Index({ name: 'fk_filtered_category_category1_idx', using: 'BTREE', order: 'ASC', unique: false })
    categoryId!: number;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_filtered_category_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
