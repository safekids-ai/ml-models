import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../../user/entities/user.entity';
import { Optional, UUIDV4 } from 'sequelize';
import { Account } from '../../../accounts/entities/account.entity';

export interface ParentConsentAttributes {
    id: string;
    userId: string;
    accountId: string;
    hasLegalAuthorityToInstall: boolean;
    boundByPrivacyPolicy: boolean;
}

interface ParentConsentCreationAttributes extends Optional<ParentConsentAttributes, 'id'> {}

@Table({ tableName: 'parent_consent', paranoid: true })
export class ParentConsent extends Model<ParentConsentAttributes, ParentConsentCreationAttributes> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, type: DataType.UUID })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.UUID })
    accountId!: string;

    @BelongsTo(() => Account)
    account?: Account;

    @Column({ field: 'has_legal_authority_to_install', type: DataType.BOOLEAN, allowNull: false })
    hasLegalAuthorityToInstall: boolean;

    @Column({ field: 'bound_by_privacy_policy', type: DataType.BOOLEAN, allowNull: false })
    boundByPrivacyPolicy: boolean;
}
