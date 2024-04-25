const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'crises_management',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            workflow: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            enabled: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1,
            },
            org_unit_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'crises_management',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_crises_management_organization_unit1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'org_unit_id' }],
                },
            ],
        },
    );
};
