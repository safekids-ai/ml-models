import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CategoryStatus } from '../category.status';
import { Optional } from 'sequelize';

export interface CategoryAttributes {
    id?: string;
    name: string;
    enabled: boolean;
    schoolDefault: boolean;
    editable: boolean;
    status: CategoryStatus;
    timeDuration: number;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

@Table({ tableName: 'category', timestamps: false })
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING })
    id?: string;

    @Column({ allowNull: false, type: DataType.STRING(150), unique: true })
    name: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    enabled: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    schoolDefault: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    editable: boolean;

    @Column({ field: 'status', type: DataType.STRING(50), allowNull: false })
    status: CategoryStatus;

    @Column({ field: 'time_duration', type: DataType.INTEGER, allowNull: true })
    timeDuration: number;
}
