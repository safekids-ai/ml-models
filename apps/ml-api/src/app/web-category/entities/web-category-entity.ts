import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {Optional} from 'sequelize';
import {WebCategoryType, WebMeta} from "@safekids-ai/web-category-types";

export interface WebCategoryAttributes {
  url: string;
  meta: WebMeta;
  source: string;
  category: number[];
  wrongCategory?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface WebCategoryCreationAttributes extends Optional<WebCategoryAttributes, 'wrongCategory'> {
}

@Table({tableName: 'web_category', paranoid: true})
export class WebCategory extends Model<WebCategoryAttributes, WebCategoryCreationAttributes> {

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    field: "url"
  })
  url!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: "meta"
  })
  meta!: WebMeta;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "source"
  })
  source!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: "category",
    validate: {
      isArrayOfNumbers(value: any) {
        if (!Array.isArray(value) || !value.every((item) => typeof item === 'number')) {
          throw new Error('Category must be an array of numbers');
        }
      }
    }
  })
  category!: number[];

  getCategory(): number[] {
    const rawValue = this.getDataValue('category');
    return Array.isArray(rawValue) ? rawValue : [];
  }

  setCategory(value: number[]) {
    if (!Array.isArray(value) || !value.every(item => typeof item === 'number')) {
      throw new Error('Category must be an array of numbers');
    }
    this.setDataValue('category', value);
  }

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: "wrong_category"
  })
  wrongCategory?: boolean;

  @Column({field: 'created_at', type: DataType.DATE})
  createdAt!: Date;

  @Column({field: 'updated_at', type: DataType.DATE})
  updatedAt!: Date;

  @Column({field: 'deleted_at', type: DataType.DATE, allowNull: true})
  deletedAt?: Date;

  @Column({field: 'created_by', allowNull: true, type: DataType.STRING(45)})
  createdBy?: string;

  @Column({field: 'updated_by', allowNull: true, type: DataType.STRING(45)})
  updatedBy?: string;
}
