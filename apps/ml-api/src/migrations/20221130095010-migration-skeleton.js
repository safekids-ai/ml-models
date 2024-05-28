'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('alter table `kid_request` add COLUMN `type` ENUM(\'INFORM\', \'ASK\') NULL AFTER `url`');
        queryInterface.sequelize.query('alter table `kid_request` add COLUMN `request_time` DATETIME NULL AFTER `type`');
        queryInterface.sequelize.query('alter table `kid_request` add COLUMN `user_device_link_id` CHAR(36) NULL AFTER `request_time`');
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('alter table `kid_request` drop COLUMN `type`');
        queryInterface.sequelize.query('alter table `kid_request` drop COLUMN `request_time`');
        queryInterface.sequelize.query('alter table `kid_request` drop COLUMN `user_device_link_id`');
    },
};
