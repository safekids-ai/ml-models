const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'filtered_url',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            url: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            org_unit_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
            enabled: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
            inherit_from_parent: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
            allowed: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
            category: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'filtered_url',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_filtered_category_organization_unit1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'org_unit_id' }],
                },
            ],
        },
    );
};
