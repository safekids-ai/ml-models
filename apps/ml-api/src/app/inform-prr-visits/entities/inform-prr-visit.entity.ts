import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Activity } from '../../activity/entities/activity.entity';
import { Optional } from 'sequelize';

export interface InformPrrVisitAttributes {
    id: number;
    activityId?: number;
    url: string;
    visitTime: Date;
}

export interface InformPrrVisitCreationAttributes extends Optional<InformPrrVisitAttributes, 'id'> {}

@Table({ tableName: 'inform_prr_visit', updatedAt: false })
export class InformPrrVisit extends Model<InformPrrVisitAttributes, InformPrrVisitCreationAttributes> {
    @Column({ type: DataType.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => Activity)
    @Column({ field: 'activity_id', allowNull: false, type: DataType.BIGINT })
    activityId: number;

    @BelongsTo(() => Activity)
    activity?: Activity;

    @Column({ field: 'visit_time', allowNull: false, type: DataType.DATE })
    visitTime: Date;

    @Column({ field: 'url', allowNull: false, type: DataType.STRING(1000) })
    url: string;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt!: Date;
}
