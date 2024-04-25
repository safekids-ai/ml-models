import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { Optional } from 'sequelize';

export interface SchoolClassAttributes {
    id: string;
    title?: string;
    classType?: string;
    location?: string;
    grades?: string;
    schoolId?: string;
    rosterStatus: string;
    dateLastModified?: Date;
    accountId: string;
}

interface SchoolClassCreationAttributes extends Optional<SchoolClassAttributes, 'id'> {}

@Table({ tableName: 'roster_class', timestamps: false })
export class SchoolClass extends Model<SchoolClassAttributes, SchoolClassCreationAttributes> {
    @Column({ allowNull: false, unique: true, primaryKey: true, type: DataType.STRING(50) })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    id!: string;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    title?: string;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    classType?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    location?: string;

    @Column({ allowNull: true, type: DataType.JSON })
    grades?: string;

    @Column({ field: 'school_id', allowNull: true, type: DataType.STRING })
    schoolId?: string;

    @Column({ field: 'roster_status', type: DataType.STRING, allowNull: true })
    rosterStatus: string;

    @Column({ field: 'date_last_modified', allowNull: true, type: DataType.DATE })
    dateLastModified?: Date;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;
}
