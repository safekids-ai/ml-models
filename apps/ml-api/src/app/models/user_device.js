const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'user_device',
        {
            devices_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'device',
                    key: 'id',
                },
            },
            users_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            login_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            last_activity: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: 'not required, we can get from activity table',
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            provision_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'user_device',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'devices_id' }, { name: 'users_id' }],
                },
                {
                    name: 'fk_userDevices_devices1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'devices_id' }],
                },
                {
                    name: 'fk_userDevices_users1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'users_id' }],
                },
            ],
        },
    );
};
