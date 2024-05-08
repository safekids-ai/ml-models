const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'group_permission',
        {
            permission_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'permission',
                    key: 'id',
                },
            },
            groups_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'group',
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'group_permission',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'permission_id' }, { name: 'groups_id' }],
                },
                {
                    name: 'fk_group_permission_permission1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'permission_id' }],
                },
                {
                    name: 'fk_group_permission_groups1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'groups_id' }],
                },
            ],
        },
    );
};
