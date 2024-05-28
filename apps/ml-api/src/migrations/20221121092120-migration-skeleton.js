'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `subscription` MODIFY COLUMN `deleted_at` DATETIME DEFAULT NULL');
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `subscription` MODIFY COLUMN `deleted_at` DATETIME NOT NULL');
    },
};
