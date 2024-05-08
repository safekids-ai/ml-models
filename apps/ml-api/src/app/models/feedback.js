const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'feedback',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            date_created: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            detail: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            device_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'user_device',
                    key: 'devices_id',
                },
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'user_device',
                    key: 'users_id',
                },
            },
        },
        {
            sequelize,
            tableName: 'feedback',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_feedback_user_device1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'device_id' }, { name: 'user_id' }],
                },
            ],
        },
    );
};
