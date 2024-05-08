import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface prrCategoryAttributes {
    id?: number;
    category: string;
}

@Table({ tableName: 'prr_category', timestamps: false })
export class prrCategory extends Model<prrCategoryAttributes, prrCategoryAttributes> implements prrCategoryAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(45) })
    category!: string;
}
