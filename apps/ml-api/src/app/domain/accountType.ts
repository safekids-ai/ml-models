import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface accountTypeAttributes {
    id?: number;
    name: string;
}

@Table({ tableName: 'account_type', timestamps: false })
export class accountType extends Model<accountTypeAttributes, accountTypeAttributes> implements accountTypeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    name!: string;
}
