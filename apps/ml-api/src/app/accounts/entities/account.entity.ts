import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Status } from '../../status/entities/status.entity';
import { AccountType } from '../../account-type/entities/account-type.entity';
import { Optional, UUIDV4 } from 'sequelize';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../billing/payment/entities/payment.entity';

export interface AccountAttributes {
    id: string;
    name: string;
    statusId?: string;
    accountTypeId: string;
    primaryDomain: string;
    contact: string;
    streetAddress: string;
    state: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    users: User[];
    payments: Payment[];
    emergencyContactName: string;
    emergencyContactPhone: string;
    interceptionCategories: object;
    onBoardingStatusId?: string;
    onBoardingStep: number;
    enableExtension?: boolean;
    stripeCustomerId?: string;
    notifyExpiredExtension?: boolean;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

@Table({ tableName: 'account', underscored: true, paranoid: true })
export class Account extends Model<AccountAttributes, AccountCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    @BelongsTo(() => Status, 'statusId')
    status: Status;

    @ForeignKey(() => AccountType)
    @Column({ field: 'account_type_id', type: DataType.STRING, allowNull: true })
    accountTypeId: string;

    @BelongsTo(() => AccountType)
    accountType: AccountType;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    primaryDomain: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    contact: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: true,
    })
    streetAddress: string;

    @Column({
        type: DataType.STRING(15),
        allowNull: true,
    })
    state: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    city: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    country: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone: string;

    @HasMany(() => User)
    public users: User[];

    @Column({
        field: 'emergency_contact_name',
        type: DataType.STRING,
        allowNull: true,
    })
    emergencyContactName: string;

    @Column({
        field: 'emergency_contact_phone',
        type: DataType.STRING,
        allowNull: true,
    })
    emergencyContactPhone: string;

    @Column({
        field: 'interception_categories',
        type: DataType.JSON,
        allowNull: true,
    })
    interceptionCategories: object;

    @ForeignKey(() => Status)
    @Column({ field: 'onboarding_status_id', type: DataType.STRING, allowNull: true })
    onBoardingStatusId?: string;

    @BelongsTo(() => Status, 'onboardingStatusId')
    onBoardingStatus: Status;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    onBoardingStep: number;

    @Column({ field: 'enable_extension', allowNull: true, type: DataType.TINYINT, defaultValue: false })
    enableExtension?: boolean;

    @Column({ field: 'stripe_customer_id', type: DataType.STRING, allowNull: true })
    stripeCustomerId?: string;

    @Column({ field: 'notify_expired_extension', type: DataType.TINYINT, allowNull: true, defaultValue: false })
    notifyExpiredExtension?: boolean;

    @HasMany(() => Payment)
    public payments: Payment[];
}
