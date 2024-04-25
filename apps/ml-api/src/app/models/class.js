const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'class_',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            source_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            location: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            grades: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            school_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'class',
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
