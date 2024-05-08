import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface UrlAttributes {
    id?: number;
    name: string;
}

interface UrlCreationAttributes extends Optional<UrlAttributes, 'id'> {}

@Table({ tableName: 'url', timestamps: false })
export class Url extends Model<UrlAttributes, UrlCreationAttributes> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id?: number;

    @Column({ allowNull: false, type: DataType.STRING(150), unique: true })
    name: string;
}
