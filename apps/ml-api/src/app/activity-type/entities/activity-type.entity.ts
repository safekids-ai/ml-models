import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface ActivityTypeAttributes {
    id: string;
    name: string;
}

interface ActivityTypeCreationAttributes extends Optional<ActivityTypeAttributes, 'id'> {}

@Table({ tableName: 'activity_type', timestamps: false })
export class ActivityType extends Model<ActivityTypeAttributes, ActivityTypeCreationAttributes> {
    @Column({ primaryKey: true, unique: true, type: DataType.STRING(30) })
    id?: string;

    @Column({ type: DataType.STRING(60) })
    name!: string;
}
