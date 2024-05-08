const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'enrollment',
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
            role: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            primary: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            begin_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            class_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'class',
                    key: 'id',
                },
            },
            student_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            teacher_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            school_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
            grade: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'enrollment',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_enrollment_class1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'class_id' }],
                },
                {
                    name: 'fk_enrollment_user1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'student_id' }],
                },
                {
                    name: 'fk_enrollment_user2_idx',
                    using: 'BTREE',
                    fields: [{ name: 'teacher_id' }],
                },
                {
                    name: 'fk_enrollment_organization_unit1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'school_id' }],
                },
            ],
        },
    );
};
