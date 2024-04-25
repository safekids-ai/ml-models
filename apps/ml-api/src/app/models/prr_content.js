const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'prr_content',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            grade_group: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            sensitivity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            screen: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            prr_level: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            options: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            heading: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'prr_content',
            timestamps: true,
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
