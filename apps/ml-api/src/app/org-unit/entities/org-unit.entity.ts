import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Device } from '../../device/entities/device.entity';
import { FilteredCategory } from '../../filtered-category/entities/filtered-category.entity';
import { FilteredUrl } from '../../filtered-url/entities/filtered-url.entity';
import { Optional } from 'sequelize';

export interface OrgUnitAttributes {
    id?: string;
    name: string;
    parent?: string;
    description?: string;
    parentOuId?: string;
    accountId?: string;
    contentSensitivityId?: number;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    orgUnitPath?: string;
    googleOrgUnitId?: string;
    statusId?: string;
}

interface OrgUnitCreationAttributes extends Optional<OrgUnitAttributes, 'id'> {}

@Table({ tableName: 'organization_unit', timestamps: false, paranoid: true })
export class OrgUnit extends Model<OrgUnitAttributes, OrgUnitCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id: string;

    @Column({ field: 'google_org_unit_id', allowNull: true, unique: true, type: DataType.STRING(200) })
    googleOrgUnitId: string;

    @Column({ type: DataType.STRING(45) })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    parent: string;

    @Column({ allowNull: true, type: DataType.STRING(200) })
    description?: string;

    @Column({ field: 'org_unit_path', allowNull: true, type: DataType.STRING(500) })
    orgUnitPath?: string;

    @Column({ field: 'parent_ou_id', allowNull: true, type: DataType.STRING(200) })
    parentOuId?: string;

    @Column({ field: 'content_sensitivity_id', type: DataType.INTEGER })
    contentSensitivityId?: number;

    //@ForeignKey(() => Account)
    @Column({ field: 'account_id', allowNull: false, type: DataType.STRING })
    accountId?: string;

    /*@BelongsTo(() => Account)
  account: Account;*/

    //@ForeignKey(() => Status)
    @Column({ field: 'status_id', type: DataType.STRING, allowNull: true })
    statusId?: string;

    //@BelongsTo(() => Status,"status_id")
    //status: Status;

    @Column({ field: 'created_at', type: DataType.DATE })
    createdAt?: Date;

    @Column({ field: 'created_by', allowNull: true, type: DataType.INTEGER })
    createdBy?: number;

    @Column({ field: 'updated_at', type: DataType.DATE })
    updatedAt?: Date;

    @Column({ field: 'updated_by', allowNull: true, type: DataType.INTEGER })
    updatedBy?: number;

    @HasMany(() => User)
    public users: User[];

    @HasMany(() => Device)
    public devices: Device[];

    @HasMany(() => FilteredCategory)
    categories: FilteredCategory[];

    @HasMany(() => FilteredUrl)
    urls: FilteredUrl[];
}
