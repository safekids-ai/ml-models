import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface userGroupAttributes {
    groupId: number;
    userId: number;
}

@Table({ tableName: 'user_group', timestamps: false })
export class userGroup extends Model<userGroupAttributes, userGroupAttributes> implements userGroupAttributes {
    @Column({ field: 'group_id', primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_user_group_group1_idx', using: 'BTREE', order: 'ASC', unique: false })
    groupId!: number;
    @Column({ field: 'user_id', primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_user_group_user1_idx', using: 'BTREE', order: 'ASC', unique: false })
    userId!: number;
}
