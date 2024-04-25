import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface PrrTriggerAttributes {
    id: string;
    trigger: string;
}

interface PrrTriggerCreationAttributes extends Optional<PrrTriggerAttributes, 'id'> {}

@Table({ tableName: 'prr_trigger', timestamps: false })
export class PrrTrigger extends Model<PrrTriggerAttributes, PrrTriggerCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING })
    id?: string;
    @Column({ type: DataType.STRING(20) })
    trigger!: string;
}
