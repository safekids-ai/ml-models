import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Optional, UUIDV4 } from 'sequelize';
import { Category } from '../../category/entities/category.entity';
import { KidRequestTypes } from './kid-request-dto';

export interface KidRequestAttributes {
    id: string;
    url: string;
    categoryId: string;
    accessGranted: boolean;
    type: KidRequestTypes;
    requestTime: Date;
    userDeviceLinkId: string;
    kidId: string;
    userId: string; //This user will grant access to url.
    updatedAt: Date;
}

interface KidRequestCreationAttributes extends Optional<KidRequestAttributes, 'id'> {}

@Table({ tableName: 'kid_request', timestamps: true })
export class KidRequest extends Model<KidRequestAttributes, KidRequestCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({ field: 'url', type: DataType.STRING(500), allowNull: false })
    url: string;

    @ForeignKey(() => Category)
    @Column({ field: 'category_id', allowNull: false, type: DataType.STRING(50) })
    categoryId: string;

    @BelongsTo(() => Category)
    category?: Category;

    @Column({ field: 'access_granted', allowNull: false, type: DataType.BOOLEAN, defaultValue: false })
    accessGranted: boolean;

    @Column({
        field: 'type',
        allowNull: true,
        type: DataType.ENUM,
        values: [KidRequestTypes.ASK, KidRequestTypes.INFORM_AI, KidRequestTypes.INFORM, KidRequestTypes.PREVENT],
    })
    type!: KidRequestTypes;

    @Column({ field: 'request_time', allowNull: true, type: DataType.DATE })
    requestTime!: Date;

    @Column({ field: 'user_device_link_id', allowNull: true, type: DataType.UUID })
    userDeviceLinkId: string;

    @ForeignKey(() => User)
    @Column({ field: 'kid_id', allowNull: true, type: DataType.UUID })
    kidId: string;

    @BelongsTo(() => User, 'kid_id')
    kid?: User;

    @ForeignKey(() => User)
    @Column({ field: 'user_id', allowNull: true, type: DataType.UUID })
    userId: string; //This user will grant access to url.

    @BelongsTo(() => User, 'user_id')
    user?: User;

    @Column({ field: 'updatedAt', type: DataType.DATE })
    updatedAt: Date;
}
