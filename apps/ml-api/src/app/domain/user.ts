import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

export interface userAttributes {
    id?: number;
    firstName: string;
    lastName?: string;
    primaryEmail?: string;
    isAdmin?: number;
    usercol?: string;
    isDelegatedAdmin?: number;
    agreedToTerms?: number;
    lastLoginTime?: Date;
    recoveryEmail?: string;
    recoveryPhone?: string;
    gender?: string;
    archived?: number;
    thumbnailPhotoEtag?: string;
    thumbnailPhotoUrl?: string;
    suspensionReason?: string;
    phones?: string;
    sms?: string;
    emails?: string;
    kind?: string;
    orgUnitPath?: string;
    orgUnitId?: number;
    organizations?: string;
    preferredFirstName?: string;
    preferredLastName?: string;
    preferredMiddleName?: string;
    accountId: number;
    cognitoId?: string;
    createdAt: Date;
    createdBy?: string;
    updatedAt: Date;
    updateBy?: string;
}

@Table({ tableName: 'user', timestamps: false })
export class user extends Model<userAttributes, userAttributes> implements userAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    @Index({ name: 'email_UNIQUE', using: 'BTREE', order: 'ASC', unique: true })
    id?: number;
    @Column({ field: 'first_name', type: DataType.STRING(100) })
    firstName!: string;
    @Column({ field: 'last_name', allowNull: true, type: DataType.STRING(100) })
    lastName?: string;
    @Column({ field: 'primary_email', allowNull: true, type: DataType.STRING(150) })
    @Index({ name: 'username_UNIQUE', using: 'BTREE', order: 'ASC', unique: true })
    primaryEmail?: string;
    @Column({ field: 'is_admin', allowNull: true, type: DataType.TINYINT, defaultValue: '0' })
    isAdmin?: number;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    usercol?: string;
    @Column({ field: 'is_delegated_admin', allowNull: true, type: DataType.TINYINT, defaultValue: '0' })
    isDelegatedAdmin?: number;
    @Column({ field: 'agreed_to_terms', allowNull: true, type: DataType.TINYINT, defaultValue: '0' })
    agreedToTerms?: number;
    @Column({ field: 'last_login_time', allowNull: true, type: DataType.DATE })
    lastLoginTime?: Date;
    @Column({ field: 'recovery_email', allowNull: true, type: DataType.STRING(100) })
    recoveryEmail?: string;
    @Column({ field: 'recovery_phone', allowNull: true, type: DataType.STRING(45) })
    recoveryPhone?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    gender?: string;
    @Column({ allowNull: true, type: DataType.TINYINT })
    archived?: number;
    @Column({ field: 'thumbnail_photo_etag', allowNull: true, type: DataType.STRING(100) })
    thumbnailPhotoEtag?: string;
    @Column({ field: 'thumbnail_photo_url', allowNull: true, type: DataType.STRING(200) })
    thumbnailPhotoUrl?: string;
    @Column({ field: 'suspension_reason', allowNull: true, type: DataType.STRING(45) })
    suspensionReason?: string;
    @Column({ allowNull: true, type: DataType.STRING(100) })
    phones?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    sms?: string;
    @Column({ allowNull: true, type: DataType.STRING(200) })
    emails?: string;
    @Column({ allowNull: true, type: DataType.STRING(45) })
    kind?: string;
    @Column({ field: 'org_unit_path', allowNull: true, type: DataType.STRING(200) })
    orgUnitPath?: string;
    @Column({ field: 'org_unit_id', allowNull: true, type: DataType.BIGINT })
    @Index({ name: 'fk_users_OrganizationUnits1_idx', using: 'BTREE', order: 'ASC', unique: false })
    orgUnitId?: number;
    @Column({ allowNull: true, type: DataType.STRING(200) })
    organizations?: string;
    @Column({ field: 'preferred_first_name', allowNull: true, type: DataType.STRING(100) })
    preferredFirstName?: string;
    @Column({ field: 'preferred_last_name', allowNull: true, type: DataType.STRING(100) })
    preferredLastName?: string;
    @Column({ field: 'preferred_middle_name', allowNull: true, type: DataType.STRING(100) })
    preferredMiddleName?: string;
    @Column({ field: 'account_id', type: DataType.BIGINT })
    @Index({ name: 'fk_users_accounts1_idx', using: 'BTREE', order: 'ASC', unique: false })
    accountId!: number;
    @Column({ field: 'cognito_id', allowNull: true, type: DataType.STRING(50) })
    cognitoId?: string;
    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
    @Column({ field: 'created_by', allowNull: true, type: DataType.STRING(45) })
    createdBy?: string;
    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
    @Column({ field: 'update_by', allowNull: true, type: DataType.STRING(45) })
    updateBy?: string;
}
