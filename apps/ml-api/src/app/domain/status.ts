import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface statusAttributes {
    id?: number;
    status: string;
}

@Table({ tableName: 'status', timestamps: false })
export class status extends Model<statusAttributes, statusAttributes> implements statusAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(20) })
    status!: string;
}
