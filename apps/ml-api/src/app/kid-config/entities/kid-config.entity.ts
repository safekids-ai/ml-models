import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../../user/entities/user.entity';
import { UUIDV4 } from 'sequelize';
import { Status } from '../../status/entities/status.entity';
import { Statuses } from '../../status/default-status';
import { ExtensionStatus } from '../enum/extension-status';

export interface KidConfigAttributes {
    id: string;
    offTime: string;
    userId: string;
    status: Statuses;
    step: number;
    extensionStatus: ExtensionStatus;
    extensionStatusUpdatedAt: Date;
    accessLimitedAt: Date;
}

interface KidConfigCreationAttributes extends Optional<KidConfigAttributes, 'id'> {}

@Table({ tableName: 'kid_config', underscored: true, timestamps: false })
export class KidConfig extends Model<KidConfigAttributes, KidConfigCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({ field: 'off_time', type: DataType.STRING(50), allowNull: true })
    offTime: string;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: false, type: DataType.UUID })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @ForeignKey(() => Status)
    @Column({ field: 'status', type: DataType.STRING, allowNull: true })
    status: Statuses;

    @BelongsTo(() => Status, 'status')
    onBoardingStatus: Status;

    @Column({ type: DataType.INTEGER, allowNull: true })
    step: number;

    @Column({ field: 'extension_status', type: DataType.STRING, allowNull: true })
    extensionStatus: ExtensionStatus;

    @Column({ field: 'extension_status_updated_at', type: DataType.DATE, allowNull: true })
    extensionStatusUpdatedAt: Date;

    @Column({ field: 'access_limited_at', type: DataType.DATE, allowNull: true })
    accessLimitedAt: Date;
}
