import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface PrrLevelAttributes {
    id: string;
    level: string;
}

export interface PrrLevelCreationAttributes extends Optional<PrrLevelAttributes, 'id'> {}

@Table({ tableName: 'prr_level', timestamps: false })
export class PrrLevel extends Model<PrrLevelAttributes, PrrLevelCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING })
    id: string;
    @Column({ type: DataType.STRING(20) })
    level!: string;
}
