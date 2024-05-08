import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../../user/entities/user.entity';
import { Optional } from 'sequelize';

export interface EnrollmentAttributes {
    id: string;
    userSourcedId: string;
    primary?: boolean;
    beginDate?: Date;
    endDate?: Date;
    classId: number;
    role: string;
    schoolId: string;
    rosterStatus: string;
    dateLastModified?: Date;
    accountId: string;
}

export interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id'> {}

@Table({ tableName: 'enrollment', timestamps: false })
export class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> {
    @Column({ primaryKey: true, unique: true, type: DataType.STRING(50) })
    id!: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_sourced_id', allowNull: true, type: DataType.STRING })
    userSourcedId: string;

    @BelongsTo(() => User, { targetKey: 'sourcedId' })
    user: User;

    @Column({ type: DataType.TINYINT, defaultValue: false })
    primary?: boolean;

    @Column({ field: 'begin_date', allowNull: true, type: DataType.DATE })
    beginDate?: Date;

    @Column({ field: 'end_date', allowNull: true, type: DataType.DATE })
    endDate?: Date;

    @Column({ field: 'class_id', type: DataType.STRING })
    classId!: number;

    @Column({ field: 'role', type: DataType.STRING })
    role: string;

    @Column({ field: 'school_id', type: DataType.STRING })
    schoolId!: string;

    @Column({ field: 'roster_status', type: DataType.STRING, allowNull: true })
    rosterStatus: string;

    @Column({ field: 'date_last_modified', allowNull: true, type: DataType.DATE })
    dateLastModified?: Date;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;
}
