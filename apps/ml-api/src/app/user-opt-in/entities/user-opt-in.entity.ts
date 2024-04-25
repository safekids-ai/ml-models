import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Optional } from 'sequelize';

export interface UserOptInAttributes {
    userId?: string;
    emailOptInSelection?: boolean;
    emailOptInTime?: Date;
    onboardingDone?: boolean;
    onboardingTime?: Date;
}

interface UserOptInCreationAttributes extends Optional<UserOptInAttributes, 'userId'> {}
@Table({ tableName: 'user_opt_in' })
export class UserOptIn extends Model<UserOptInAttributes, UserOptInCreationAttributes> {
    @ForeignKey(() => User)
    @Column({ primaryKey: true, field: 'user_id', allowNull: false, type: DataType.UUID })
    userId: string;

    @Column({ field: 'email_opt_in', allowNull: true, type: DataType.BOOLEAN })
    emailOptInSelection?: boolean;

    @Column({ field: 'email_opt_in_time', allowNull: true, type: DataType.DATE })
    emailOptInTime?: Date;

    @Column({ field: 'onboarding_done', allowNull: true, type: DataType.BOOLEAN })
    onboardingDone?: boolean;

    @Column({ field: 'onboarding_time', allowNull: true, type: DataType.DATE })
    onboardingTime?: Date;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt!: Date;
}
