import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Optional, UUIDV4 } from 'sequelize';

export interface HealthAttributes {
    id: string;
    name: string;
}

interface HealthCreationAttributes extends Optional<HealthAttributes, 'id'> {}

@Table({ tableName: 'health', timestamps: false })
export class Health extends Model<HealthAttributes, HealthCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}
