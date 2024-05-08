const Sequelize = require('sequelize');
const { Statuses } = require('../status/default-status');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'organization_unit',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            user_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: 'TEACHER\nPARENT\nKIDS',
            },
            parent_ou_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
            created_by: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING(45),
                allowNull: false,
                defaultValue: Statuses.ACTIVE,
            },
            org_type: {
                type: DataTypes.STRING(45),
                allowNull: false,
                comment: 'DISTRICT\nSCHOOL\nFAMILY\nOU',
            },
            content_sensitivity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'account',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'organization_unit',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'name_UNIQUE',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_OrganizationUnits_OrganizationUnits1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'parent_ou_id' }],
                },
                {
                    name: 'fk_organization_unit_account1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'account_id' }],
                },
            ],
        },
    );
};
