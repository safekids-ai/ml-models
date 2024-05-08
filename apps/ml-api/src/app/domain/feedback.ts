import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface feedbackAttributes {
    id?: number;
    dateCreated: Date;
    detail: object;
    type: string;
    accountId: number;
    userDeviceId: number;
}

@Table({ tableName: 'feedback', timestamps: false })
export class feedback extends Model<feedbackAttributes, feedbackAttributes> implements feedbackAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'date_created', type: DataType.DATE })
    dateCreated!: Date;
    @Column({ type: DataType.JSON })
    detail!: object;
    @Column({ type: DataType.STRING(45) })
    type!: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    accountId!: number;
    @Column({ field: 'user_device_id', type: DataType.BIGINT })
    @Index({ name: 'fk_feedback_user_device1_idx', using: 'BTREE', order: 'ASC', unique: false })
    userDeviceId!: number;
}
