import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface contentSensitivityAttributes {
    id?: number;
    value: string;
}

@Table({ tableName: 'content_sensitivity', timestamps: false })
export class contentSensitivity extends Model<contentSensitivityAttributes, contentSensitivityAttributes> implements contentSensitivityAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(20) })
    value!: string;
}
