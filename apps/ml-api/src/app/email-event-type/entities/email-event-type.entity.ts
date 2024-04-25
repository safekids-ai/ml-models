import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface EmailEventTypeAttributes {
    id: string;
    type: string;
}

interface EmailEventTypeCreationAttributes extends Optional<EmailEventTypeAttributes, 'id'> {}

@Table({ tableName: 'email_event_type', createdAt: false, updatedAt: false })
export class EmailEventType extends Model<EmailEventTypeAttributes, EmailEventTypeCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.STRING(50) })
    id?: string;

    @Column({ allowNull: false, type: DataType.STRING(50), unique: true })
    type: string;
}
