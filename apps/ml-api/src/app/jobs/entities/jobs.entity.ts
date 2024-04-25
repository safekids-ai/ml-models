import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';
import { JobStatus } from '../dto/job.status';
import { User } from '../../user/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { JobType } from '../dto/job.type';

export interface JobAttributes {
    id: string;
    remarks: string;
    status: JobStatus;
    type: JobType;
    startDate: Date;
    endDate: Date;
    userId: string;
    accountId: string;
}

interface JobCreationAttributes extends Optional<JobAttributes, 'id'> {}

@Table({ tableName: 'jobs', timestamps: false })
export class Job extends Model<JobAttributes, JobCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: true })
    remarks: string;

    @Column({ type: DataType.STRING, allowNull: false })
    status: JobStatus;

    @Column({ type: DataType.STRING, allowNull: false })
    type: JobType;

    @Column({ field: 'start_date', type: DataType.DATE, allowNull: true })
    startDate: Date;

    @Column({ field: 'end_date', type: DataType.DATE, allowNull: true })
    endDate: Date;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, type: DataType.UUID })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId!: string;

    @BelongsTo(() => Account)
    account?: Account;
}
