import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface roleAttributes {
    id?: number;
    role: string;
}

@Table({ tableName: 'role', timestamps: false })
export class role extends Model<roleAttributes, roleAttributes> implements roleAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(50) })
    role!: string;
}
