import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface schoolTypeAttributes {
    id?: number;
    type: string;
}

@Table({ tableName: 'school_type', timestamps: false })
export class schoolType extends Model<schoolTypeAttributes, schoolTypeAttributes> implements schoolTypeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(30) })
    type!: string;
}
