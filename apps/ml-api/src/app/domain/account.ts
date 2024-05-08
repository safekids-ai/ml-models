import { Table, Column, Model, DataType, ForeignKey, Index } from 'sequelize-typescript';

export interface accountAttributes {
    id: number;
    districtName: string;
    primaryDomain: string;
    contact?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress?: string;
    state?: string;
    city?: string;
    country?: string;
    accountTypeId: number;
    statusId: number;
    schoolTypeId: number;
    createdAt: Date;
    updatedAt: Date;
}

@Table({ tableName: 'account', timestamps: false })
export class account extends Model<accountAttributes, accountAttributes> implements accountAttributes {
    @Column({ primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id!: number;
    @Column({ field: 'district_name', type: DataType.STRING(50) })
    districtName!: string;
    @Column({ field: 'primary_domain', type: DataType.STRING(50) })
    primaryDomain!: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    contact?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    email?: string;
    @Column({ field: 'phone_number', allowNull: true, type: DataType.STRING(15) })
    phoneNumber?: string;
    @Column({ field: 'street_address', allowNull: true, type: DataType.STRING(100) })
    streetAddress?: string;
    @Column({ allowNull: true, type: DataType.STRING(20) })
    state?: string;
    @Column({ allowNull: true, type: DataType.STRING(30) })
    city?: string;
    @Column({ allowNull: true, type: DataType.STRING(30) })
    country?: string;
    @Column({ field: 'account_type_id', type: DataType.INTEGER })
    @Index({ name: 'fk_account_account_type1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountTypeId!: number;
    @Column({ field: 'status_id', type: DataType.INTEGER })
    @Index({ name: 'fk_account_status1_idx', using: 'BTREE', order: 'ASC', unique: false })
    statusId!: number;
    @Column({ field: 'school_type_id', type: DataType.INTEGER })
    @Index({ name: 'fk_account_school_type1_idx', using: 'BTREE', order: 'ASC', unique: false })
    schoolTypeId!: number;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
}
