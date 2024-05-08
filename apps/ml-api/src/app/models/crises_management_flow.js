const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'crises_management_flow',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            step: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            user_name: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            contact: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            message_type: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            crises_management_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'crises_management',
                    key: 'id',
                },
            },
            message_template_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'message_template',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'crises_management_flow',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_crises_management_flow_crises_management1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'crises_management_id' }],
                },
                {
                    name: 'fk_crises_management_flow_message_template1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'message_template_id' }],
                },
            ],
        },
    );
};
