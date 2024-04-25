import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface StatusAttributes {
    id: string;
    status: string;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, 'id'> {}

@Table({ tableName: 'status', underscored: true, createdAt: false, updatedAt: false })
export class Status extends Model<StatusAttributes, StatusCreationAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    status: string;
}
