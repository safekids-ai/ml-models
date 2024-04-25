import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Account } from '../../accounts/entities/account.entity';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';
import { Status } from '../../status/entities/status.entity';
import { Role } from '../../role/entities/role.entity';
import { UserRoles } from '../user.roles';
import { UserCode } from '../../consumer/user-code/entities/user-code.entity';
import { Optional } from 'sequelize';

export interface UserAttributes {
    id?: string;
    firstName: string;
    lastName?: string;
    email?: string;
    agreedToTerms?: number;
    lastLoginTime?: Date;
    recoveryEmail?: string;
    recoveryPhone?: string;
    gender?: string;
    thumbnailPhotoEtag?: string;
    thumbnailPhotoUrl?: string;
    phone?: string;
    sms?: string;
    schoolName?: string;
    kind?: string;
    orgUnitPath?: string;
    orgUnitId?: string;
    organizations?: string;
    preferredFirstName?: string;
    preferredLastName?: string;
    preferredMiddleName?: string;
    accountId: string;
    sourceId?: string;
    limitAccess?: boolean;
    userName?: string;
    enabledUser?: boolean;
    givenName?: string;
    familyName?: string;
    middleName?: string;
    identifier?: string;
    googleUserId?: string;
    role?: UserRoles;
    statusId?: string;
    accessCode: string | null;
    accessLimited: boolean;
    isAdmin?: number;
    yearOfBirth?: string;
    password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({ tableName: 'user', paranoid: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    id!: string;

    @Column({ field: 'first_name', type: DataType.STRING(100) })
    firstName!: string;

    @Column({ field: 'last_name', allowNull: true, type: DataType.STRING(100) })
    lastName?: string;

    @Column({ field: 'primary_email', allowNull: false, type: DataType.STRING(150), unique: true })
    email: string;

    @Column({ field: 'access_code', allowNull: true, type: DataType.STRING(20), unique: true })
    accessCode: string;

    @Column({ field: 'year_of_birth', allowNull: true, type: DataType.STRING(4) })
    yearOfBirth: string;

    //......................roster columns start.......................

    @Column({ field: 'password', type: DataType.STRING(100) })
    password!: string;

    @Column({ field: 'user_name', allowNull: true, type: DataType.STRING(100) })
    userName: string;

    @Column({ field: 'enabled_user', allowNull: true, type: DataType.BOOLEAN })
    enabledUser: boolean;

    @Column({ field: 'given_name', allowNull: true, type: DataType.STRING(100) })
    givenName: string;

    @Column({ field: 'family_name', allowNull: true, type: DataType.STRING(100) })
    familyName: string;

    @Column({ field: 'middle_name', allowNull: true, type: DataType.STRING(100) })
    middleName: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    identifier: string;

    @Column({ field: 'roster_sourced_id', type: DataType.STRING(200), unique: true, allowNull: true })
    sourcedId?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    dateLastModified: Date;

    @Column({ field: 'roster_status', type: DataType.STRING, allowNull: true })
    rosterStatus: string;

    //......................roster columns end.......................

    @Column({ field: 'is_admin', allowNull: true, type: DataType.TINYINT, defaultValue: '0' })
    isAdmin?: number;

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
    phone?: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    sms?: string;

    @Column({ field: 'school_name', allowNull: true, type: DataType.STRING(200) })
    schoolName: string;

    @Column({ allowNull: true, type: DataType.STRING(45) })
    kind?: string;

    @Column({ field: 'org_unit_path', allowNull: true, type: DataType.STRING(200) })
    orgUnitPath?: string;

    @ForeignKey(() => OrgUnit)
    @Column({ field: 'org_unit_id', allowNull: true, type: DataType.UUID })
    orgUnitId: string;

    @BelongsTo(() => OrgUnit)
    orgUnit: OrgUnit;

    @ForeignKey(() => Account)
    @Column({ field: 'account_id', type: DataType.UUID, allowNull: false })
    accountId!: string;

    @BelongsTo(() => Account)
    account: Account;

    @Column({ field: 'cognito_id', allowNull: true, type: DataType.STRING(50) })
    cognitoId?: string;

    @ForeignKey(() => Role)
    @Column({ field: 'role', type: DataType.STRING, allowNull: false, defaultValue: UserRoles.STUDENT })
    role?: UserRoles;

    @BelongsTo(() => Role)
    userRole: Role;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    @BelongsTo(() => Status)
    status: Status;

    @Column({ field: 'access_limited', type: DataType.BOOLEAN, defaultValue: false })
    accessLimited!: boolean;

    @Column({ field: 'google_user_id', type: DataType.STRING(100), unique: true, allowNull: true })
    googleUserId?: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;

    @Column({ field: 'deleted_at', type: DataType.DATE, allowNull: true })
    deletedAt!: Date;

    @Column({ field: 'update_by', allowNull: true, type: DataType.STRING(45) })
    updateBy?: string;

    @Column({ field: 'created_by', allowNull: true, type: DataType.STRING(45) })
    createdBy?: string;

    @HasMany(() => UserCode)
    public userCodes: UserCode[];
}
