import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface groupPermissionAttributes {
    permissionId: number;
    groupsId: number;
    status?: string;
    createdAt?: Date;
}

@Table({ tableName: 'group_permission', timestamps: false })
export class groupPermission extends Model<groupPermissionAttributes, groupPermissionAttributes> implements groupPermissionAttributes {
    @Column({ field: 'permission_id', primaryKey: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_group_permission_permission1_idx', using: 'BTREE', order: 'ASC', unique: false })
    permissionId!: number;
    @Column({ field: 'groups_id', primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'fk_group_permission_groups1_idx', using: 'BTREE', order: 'ASC', unique: false })
    groupsId!: number;
    @Column({ allowNull: true, type: DataType.STRING(20) })
    status?: string;
    @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
    createdAt?: Date;
}
