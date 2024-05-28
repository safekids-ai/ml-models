'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `kid_request` ADD INDEX `updated_at_idx` (`updatedAt` ASC)');
        queryInterface.sequelize.query('ALTER TABLE `kid_request` ADD INDEX `request_time_idx` (`request_time` DESC)');
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `kid_request` DROP INDEX `updated_at_idx`');
        queryInterface.sequelize.query('ALTER TABLE `kid_request` DROP INDEX `request_time_idx`');
    },
};

