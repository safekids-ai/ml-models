import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface classAttributes {
    id?: number;
    sourceId: string;
    title?: string;
    location?: string;
    grades?: object;
    schoolId?: string;
}

@Table({ tableName: 'class', timestamps: false })
export class schoolClass extends Model<classAttributes, classAttributes> implements classAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'source_id', type: DataType.STRING(50) })
    sourceId!: string;
    @Column({ allowNull: true, type: DataType.STRING(50) })
    title?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    location?: string;
    @Column({ allowNull: true, type: DataType.JSON })
    grades?: object;
    @Column({ field: 'school_id', allowNull: true, type: DataType.STRING(50) })
    schoolId?: string;
}
