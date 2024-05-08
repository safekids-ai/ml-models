import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface permissionAttributes {
    id?: number;
    name: string;
    description?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({ tableName: 'permission', timestamps: false })
export class permission extends Model<permissionAttributes, permissionAttributes> implements permissionAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING })
    description?: string;
    @Column({ allowNull: true, type: DataType.STRING(20) })
    status?: string;
    @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
    createdAt?: Date;
    @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
    updatedAt?: Date;
}
