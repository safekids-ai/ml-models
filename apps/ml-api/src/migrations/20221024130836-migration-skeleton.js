'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            'ALTER TABLE `kid_config` ADD COLUMN `access_limited_at` DATETIME DEFAULT NULL');
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `kid_config` DROP COLUMN `access_limited_at`');
    },
};

