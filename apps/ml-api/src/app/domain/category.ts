import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface categoryAttributes {
    id?: number;
    name: string;
    description?: string;
}

@Table({ tableName: 'category', timestamps: false })
export class category extends Model<categoryAttributes, categoryAttributes> implements categoryAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(40) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING })
    description?: string;
}
