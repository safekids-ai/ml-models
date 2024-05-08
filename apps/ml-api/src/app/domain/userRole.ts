import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface userRoleAttributes {
    id: number;
    roleId: number;
    userId: number;
}

@Table({ tableName: 'user_role', timestamps: false })
export class userRole extends Model<userRoleAttributes, userRoleAttributes> implements userRoleAttributes {
    @Column({ type: DataType.BIGINT })
    id!: number;
    @Column({ field: 'role_id', type: DataType.INTEGER })
    @Index({ name: 'fk_user_role_role1_idx', using: 'BTREE', order: 'ASC', unique: false })
    roleId!: number;
    @Column({ field: 'user_id', type: DataType.BIGINT })
    @Index({ name: 'fk_user_role_user1_idx', using: 'BTREE', order: 'ASC', unique: false })
    userId!: number;
}
