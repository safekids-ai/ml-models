import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface emergencyContactAttributes {
    id?: number;
    name: object;
    email: string;
    phone?: string;
    enabled?: number;
    orgUnitId: number;
    role: string;
    accountId: number;
    createdAt: Date;
}

@Table({ tableName: 'emergency_contact', timestamps: false })
export class emergencyContact extends Model<emergencyContactAttributes, emergencyContactAttributes> implements emergencyContactAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.JSON })
    name!: object;
    @Column({ type: DataType.STRING(100) })
    email!: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    phone?: string;
    @Column({ allowNull: true, type: DataType.TINYINT, defaultValue: '1' })
    enabled?: number;
    @Column({ field: 'org_unit_id', type: DataType.BIGINT })
    @Index({ name: 'fk_crises_management_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgUnitId!: number;
    @Column({ type: DataType.STRING(45) })
    role!: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_crises_management_copy1_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
}
