const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'device',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            os: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            schools_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            device_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            serial_number: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            device_types_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'device_type',
                    key: 'id',
                },
            },
            cpu_model: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            wifi_mac: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            ethernet_mac: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            imei: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            os_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            paltform_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            directory_api_id: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            organization_unit_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'organization_unit',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'device',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }, { name: 'device_types_id' }, { name: 'organization_unit_id' }],
                },
                {
                    name: 'id_UNIQUE',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_devices_device_types1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'device_types_id' }],
                },
                {
                    name: 'fk_device_organization_unit1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'organization_unit_id' }],
                },
            ],
        },
    );
};
