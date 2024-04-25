import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface enrollmentAttributes {
    id?: number;
    sourceId: string;
    role: string;
    primary?: number;
    beginDate?: Date;
    endDate?: Date;
    classId: number;
    studentId: number;
    teacherId: number;
    schoolId: number;
    grade?: string;
    accountId: number;
}

@Table({ tableName: 'enrollment', timestamps: false })
export class enrollment extends Model<enrollmentAttributes, enrollmentAttributes> implements enrollmentAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'source_id', type: DataType.STRING(50) })
    sourceId!: string;
    @Column({ type: DataType.STRING(45) })
    role!: string;
    @Column({ type: DataType.TINYINT, defaultValue: '0' })
    primary?: number;
    @Column({ field: 'begin_date', allowNull: true, type: DataType.DATE })
    beginDate?: Date;
    @Column({ field: 'end_date', allowNull: true, type: DataType.DATE })
    endDate?: Date;
    @Column({ field: 'class_id', type: DataType.BIGINT })
    @Index({ name: 'fk_enrollment_class1_idx', using: 'BTREE', order: 'ASC', unique: false })
    classId!: number;
    @Column({ field: 'student_id', type: DataType.BIGINT })
    @Index({ name: 'fk_enrollment_user1_idx', using: 'BTREE', order: 'ASC', unique: false })
    studentId!: number;
    @Column({ field: 'teacher_id', type: DataType.BIGINT })
    @Index({ name: 'fk_enrollment_user2_idx', using: 'BTREE', order: 'ASC', unique: false })
    teacherId!: number;
    @Column({ field: 'school_id', type: DataType.BIGINT })
    @Index({ name: 'fk_enrollment_organization_unit1_idx', using: 'BTREE', order: 'ASC', unique: false })
    schoolId!: number;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    grade?: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_enrollment_account1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
}
