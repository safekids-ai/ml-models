import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface filteredUrlAttributes {
    id?: number;
    url: string;
    orgUnitId: number;
    enabled?: number;
    inheritFromParent?: number;
    allowed?: number;
    accountId: number;
}

@Table({ tableName: 'filtered_url', timestamps: false })
export class filteredUrl extends Model<filteredUrlAttributes, filteredUrlAttributes> implements filteredUrlAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(150) })
    url!: string;
    @Column({ field: 'org_unit_id', type: DataType.BIGINT })
    @Index({ name: 'fk_filtered_category_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgUnitId!: number;
    @Column({ type: DataType.TINYINT, defaultValue: '1' })
    enabled?: number;
    @Column({ field: 'inherit_from_parent', type: DataType.TINYINT, defaultValue: '1' })
    inheritFromParent?: number;
    @Column({ type: DataType.TINYINT, defaultValue: '1' })
    allowed?: number;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_filtered_url_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
