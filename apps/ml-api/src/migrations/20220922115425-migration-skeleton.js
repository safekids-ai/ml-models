'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            'ALTER TABLE `kid_config` ADD COLUMN `extension_status` varchar(50) DEFAULT NULL, ADD COLUMN `extension_status_updated_at` DATETIME DEFAULT NULL',
        );
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `kid_config` DROP COLUMN `extension_status`, DROP COLUMN `extension_status_updated_at`');
    },
};

