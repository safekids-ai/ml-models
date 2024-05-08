import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { PrrUserAction } from '../prr-action.default';
import { Optional } from 'sequelize';

export interface PrrActionAttributes {
    id: PrrUserAction;
    action: string;
}

export interface PrrActionCreationAttributes extends Optional<PrrActionAttributes, 'id'> {}

@Table({ tableName: 'prr_action', timestamps: false })
export class PrrAction extends Model<PrrActionAttributes, PrrActionCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING(50) })
    id: PrrUserAction;
    @Column({ type: DataType.STRING(50) })
    action!: string;
}
