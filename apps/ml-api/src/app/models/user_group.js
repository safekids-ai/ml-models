const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'user_group',
        {
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'group',
                    key: 'id',
                },
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'user_group',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'group_id' }, { name: 'user_id' }],
                },
                {
                    name: 'fk_user_group_group1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'group_id' }],
                },
                {
                    name: 'fk_user_group_user1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'user_id' }],
                },
            ],
        },
    );
};
