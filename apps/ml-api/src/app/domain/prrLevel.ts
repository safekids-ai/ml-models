import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface prrLevelAttributes {
    id?: number;
    level: string;
}

@Table({ tableName: 'prr_level', timestamps: false })
export class prrLevel extends Model<prrLevelAttributes, prrLevelAttributes> implements prrLevelAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(20) })
    level!: string;
}
