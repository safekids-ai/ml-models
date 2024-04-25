const Sequelize = require('sequelize');
const { Statuses } = require('../status/default-status');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'account',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            contact: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            primarydomain: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(45),
                allowNull: false,
                defaultValue: Statuses.ACTIVE,
            },
        },
        {
            sequelize,
            tableName: 'account',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
            ],
        },
    );
};
