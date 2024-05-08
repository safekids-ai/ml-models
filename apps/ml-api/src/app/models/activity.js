const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const Activity = sequelize.define(
        'activity',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            activity_types_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'activity_type',
                    key: 'id',
                },
            },
            user_devices_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            extension_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            browser_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            os: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            ip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            prr_trigger: {
                type: DataTypes.STRING(45),
                allowNull: true,
                comment: 'What triggered the PRR?\nhost_url\nai-vision\nai-nlp\nai-vision-nlp\naccess_limited',
            },
            prr_level: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            prr_images: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            prr_texts: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            prr_category: {
                type: DataTypes.STRING(45),
                allowNull: true,
                comment: 'Aggressive-Other\nAlcohol\nBody Image\nDrugs\netc',
            },
            prr_messages: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'array of messages and responses by user',
            },
            prr_activity_type: {
                type: DataTypes.STRING(45),
                allowNull: true,
                comment: 'take_me_back\ntell_me_more\n....\n',
            },
            location: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            app_name: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            web_url: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            web_title: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            browser: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            ml_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            nlp_version: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'category',
                    key: 'id',
                },
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
            root_org_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: 'District or Root School',
            },
            org_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            teacher_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            teacher_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            user_email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            activity_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            activity_type: {
                type: DataTypes.STRING(45),
                allowNull: false,
                comment: 'url_click\nsearch_click\nprr_click',
            },
            device_mac_address: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            device_ip_address: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            device_public_wan: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            full_web_url: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            web_category: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            access_limited: {
                type: DataTypes.TINYINT,
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
        },
        {
            sequelize,
            tableName: 'activity',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'fk_activity_activityTypes1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'activity_types_id' }],
                },
                {
                    name: 'fk_activity_category1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'category_id' }],
                },
                {
                    name: 'fk_activity_user_device1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'device_id' }, { name: 'user_id' }],
                },
                {
                    name: 'fk_activity_class1_idx',
                    using: 'BTREE',
                    fields: [{ name: 'class_id' }],
                },
            ],
        },
    );
    return Activity;
};
