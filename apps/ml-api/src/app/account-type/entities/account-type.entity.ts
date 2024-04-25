import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface AccountTypeAttributes {
    id: string;
    type: string;
}

interface AccountTypeCreationAttributes extends Optional<AccountTypeAttributes, 'id'> {}
@Table({ tableName: 'account_type', underscored: true, createdAt: false, updatedAt: false })
export class AccountType extends Model<AccountTypeAttributes, AccountTypeCreationAttributes> {
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
    type: string;
}
