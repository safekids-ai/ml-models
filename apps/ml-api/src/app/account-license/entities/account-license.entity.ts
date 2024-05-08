import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { License } from '../../license/entities/license.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Optional } from 'sequelize';

export interface AccountLicenseAttributes {
    id?: string;
    key: string;
    name: string;
    enabled?: boolean;
    accountId: string;
    licenseId: string;
    expiresAt: Date;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AccountLicenseCreationAttributes extends Optional<AccountLicenseAttributes, 'id'> {}

@Table({ tableName: 'account_license', paranoid: true })
export class AccountLicense extends Model<AccountLicenseAttributes, AccountLicenseCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(200) })
    key!: string;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', type: DataType.UUID })
    accountId!: string;

    @BelongsTo(() => Account)
    account?: Account;

    @ForeignKey(() => License)
    @Column({ field: 'license_id', type: DataType.STRING })
    licenseId!: string;

    @BelongsTo(() => License)
    license?: License;

    @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
    enabled!: boolean;

    @Column({ field: 'expires_at', type: DataType.DATE })
    expiresAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
}
