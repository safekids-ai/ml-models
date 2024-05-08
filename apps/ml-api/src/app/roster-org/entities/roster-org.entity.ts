import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { Optional } from 'sequelize';

export interface RosterOrgAttributes {
    id: string;
    name: string;
    identifier?: string;
    type?: string;
    dateLastModified?: Date;
    rosterStatus: string;
    accountId?: string;
}

interface RosterOrgCreationAttributes extends Optional<RosterOrgAttributes, 'id'> {}

@Table({ tableName: 'roster_org', timestamps: false, paranoid: true })
export class RosterOrg extends Model<RosterOrgAttributes, RosterOrgCreationAttributes> {
    @Column({ type: DataType.STRING, allowNull: false, unique: true, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    identifier: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @Column({ type: DataType.STRING, allowNull: true })
    dateLastModified: Date;

    @Column({ field: 'roster_status', type: DataType.STRING, allowNull: true })
    rosterStatus: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId: string;

    @BelongsTo(() => Account)
    account: Account;
}
