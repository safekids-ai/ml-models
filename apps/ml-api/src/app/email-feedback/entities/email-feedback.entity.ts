import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface EmailMLFeedbackAttributes {
    id?: string;
    emailDateTime: Date;
    fromName: string;
    fromEmail: string;
    toName: string;
    toEmail: string;
    subject: string;
    body: string;
    mlVersion: string;
    extVersion: string;
    threadId: string;
}

interface EmailMLFeedbackCreationAttributes extends Optional<EmailMLFeedbackAttributes, 'id'> {}

@Table({ tableName: 'email_ml_feedback' })
export class EmailMLFeedback extends Model<EmailMLFeedbackAttributes, EmailMLFeedbackCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string;

    @Column({ field: 'email_date_time', allowNull: false, type: DataType.DATE })
    emailDateTime: Date;

    @Column({ field: 'from_name', type: DataType.STRING(255) })
    fromName: string;

    @Column({ field: 'from_email', allowNull: false, type: DataType.STRING(320) })
    fromEmail: string;

    @Column({ field: 'to_name', type: DataType.STRING(255) })
    toName: string;

    @Column({ field: 'to_email', allowNull: false, type: DataType.STRING(320) })
    toEmail: string;

    @Column({ field: 'cc_email', type: DataType.STRING(955) })
    ccEmail: string;

    @Column({ field: 'subject', allowNull: false, type: DataType.STRING(955) })
    subject: string;

    @Column({ field: 'body', allowNull: false, type: DataType.STRING(5000) })
    body: string;

    @Column({ field: 'thread_id', type: DataType.STRING(200) })
    threadId: string;

    @Column({ field: 'ext_version', type: DataType.STRING(25) })
    extVersion: string;

    @Column({ field: 'ml_version', type: DataType.STRING(25) })
    mlVersion: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;
}
