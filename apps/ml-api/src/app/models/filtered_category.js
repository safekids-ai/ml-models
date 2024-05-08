const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'filtered_category',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
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
                allowNull: true,
            },
            inherit_from_parent: {
                type: DataTypes.TINYINT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'filtered_category',
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
