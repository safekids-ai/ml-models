import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface prrContentAttributes {
    id?: number;
    gradeGroup: string;
    sensitivity?: number;
    screen?: string;
    prrLevel?: string;
    content?: string;
    options?: object;
    createdAt: Date;
    createdBy?: string;
    heading?: string;
}

@Table({ tableName: 'prr_content', timestamps: false })
export class prrContent extends Model<prrContentAttributes, prrContentAttributes> implements prrContentAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'grade_group', type: DataType.STRING(45) })
    gradeGroup!: string;
    @Column({ allowNull: true, type: DataType.INTEGER })
    sensitivity?: number;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    screen?: string;
    @Column({ field: 'prr_level', allowNull: true, type: DataType.STRING(45) })
    prrLevel?: string;
    @Column({ allowNull: true, type: DataType.STRING })
    content?: string;
    @Column({ allowNull: true, type: DataType.JSON })
    options?: object;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'created_by', allowNull: true, type: DataType.STRING(45) })
    createdBy?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    heading?: string;
}
