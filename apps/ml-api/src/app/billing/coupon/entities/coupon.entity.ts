import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CouponStatus } from '../coupon.status.enum';

export interface CouponAttributes {
    id: string;
    code: string;
    status: CouponStatus;
}

interface CouponCreationAttributes extends Optional<CouponAttributes, 'id'> {}

@Table({ tableName: 'coupon', underscored: true, paranoid: true })
export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code: string;

    @Column({ type: DataType.ENUM, allowNull: false, values: [CouponStatus.ACTIVE, CouponStatus.INACTIVE] })
    status: CouponStatus;
}
