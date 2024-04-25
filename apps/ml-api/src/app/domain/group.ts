import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface groupAttributes {
    id?: number;
    name: string;
    description?: string;
}

@Table({ tableName: 'group', timestamps: false })
export class group extends Model<groupAttributes, groupAttributes> implements groupAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING(200) })
    description?: string;
}
