const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'user',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            preferred_first_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            preferred_last_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            orgunit_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
            user_type: {
                type: DataTypes.STRING(45),
                allowNull: true,
                comment: 'can be foreign key from user_types table',
            },
            created_by: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: true,
                unique: 'username_UNIQUE',
            },
            status: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            last_login_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'account',
                    key: 'id',
                },
            },
            cognito_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            preferred_middle_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            enabled_user: {
                type: DataTypes.TINYINT,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            sms: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            roles: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            primary_org: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'user',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'email_UNIQUE',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'username_UNIQUE',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'email' }],
                },
                {
                    name: 'fk_users_OrganizationUnits1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'orgunit_id' }],
                },
                {
                    name: 'fk_users_accounts1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'account_id' }],
                },
            ],
        },
    );
};
