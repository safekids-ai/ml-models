import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../../user/entities/user.entity';
import { UUIDV4, Optional } from 'sequelize';
import { CodeType } from '../code_type';

export interface UserCodeAttributes {
    id: string;
    userId: string;
    codeType: CodeType;
    code: string;
}

export interface UserCodeCreationAttributes extends Optional<UserCodeAttributes, 'id'> {}

@Table({ tableName: 'user_code', paranoid: true })
export class UserCode extends Model<UserCodeAttributes, UserCodeCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, type: DataType.UUID })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @Column({
        field: 'code_type',
        type: DataType.ENUM,
        allowNull: false,
        values: [CodeType.EMAIL, CodeType.PASSWORD, CodeType.SMS],
    })
    codeType: CodeType;

    @Column({ field: 'code', type: DataType.STRING, allowNull: false })
    code: string;
}
