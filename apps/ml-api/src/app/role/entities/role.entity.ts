import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface RoleAttributes {
    id?: string;
    role: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}
@Table({ tableName: 'role', underscored: true, createdAt: false, updatedAt: false })
export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
    @Column({ primaryKey: true, unique: true, type: DataType.STRING })
    id?: string;

    @Column({ type: DataType.STRING(50) })
    role!: string;
}
