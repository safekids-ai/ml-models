import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface messageTemplateAttributes {
    id?: number;
    type: string;
    format: string;
    subject?: string;
    body?: string;
    createdAt: Date;
    title: string;
}

@Table({ tableName: 'message_template', timestamps: false })
export class messageTemplate extends Model<messageTemplateAttributes, messageTemplateAttributes> implements messageTemplateAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(20), comment: 'email\nsms\nphone' })
    type!: string;
    @Column({ type: DataType.STRING(20), comment: 'text\naudio' })
    format!: string;
    @Column({ allowNull: true, type: DataType.STRING(100) })
    subject?: string;
    @Column({ allowNull: true, type: DataType.STRING })
    body?: string;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ type: DataType.STRING(45) })
    title!: string;
}
