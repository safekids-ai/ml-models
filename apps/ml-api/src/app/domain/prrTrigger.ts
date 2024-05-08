import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface prrTriggerAttributes {
    id?: number;
    trigger: string;
}

@Table({ tableName: 'prr_trigger', timestamps: false })
export class prrTrigger extends Model<prrTriggerAttributes, prrTriggerAttributes> implements prrTriggerAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ type: DataType.STRING(20) })
    trigger!: string;
}
