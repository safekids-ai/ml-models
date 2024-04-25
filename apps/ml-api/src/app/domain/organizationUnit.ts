import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface organizationUnitAttributes {
    id?: number;
    name: string;
    description?: string;
    parentOuId?: number;
    accountId?: string;
    contentSensitivityId: number;
    createdAt: Date;
    createdBy?: number;
    updatedAt: Date;
    updatedBy?: number;
    statusId: number;
}

@Table({ tableName: 'organization_unit', timestamps: false })
export class organizationUnit extends Model<organizationUnitAttributes, organizationUnitAttributes> implements organizationUnitAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING(200) })
    description?: string;
    @Column({ field: 'parent_ou_id', allowNull: true, type: DataType.BIGINT })
    @Index({ name: 'fk_OrganizationUnits_OrganizationUnits1_idx', using: 'BTREE', order: 'ASC', unique: false })
    parentOuId?: number;
    @Column({ field: 'account_id', allowNull: true, type: DataType.STRING })
    @Index({ name: 'fk_organization_unit_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId?: string;
    @Column({ field: 'content_sensitivity_id', type: DataType.INTEGER })
    @Index({ name: 'fk_organization_unit_content_sensitivity1_idx', using: 'BTREE', order: 'ASC', unique: false })
    contentSensitivityId!: number;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'created_by', allowNull: true, type: DataType.INTEGER })
    createdBy?: number;
    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
    @Column({ field: 'updated_by', allowNull: true, type: DataType.INTEGER })
    updatedBy?: number;
    @Column({ field: 'status_id', type: DataType.INTEGER })
    @Index({ name: 'fk_organization_unit_status1_idx', using: 'BTREE', order: 'ASC', unique: false })
    statusId!: number;
}
