'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            'ALTER TABLE `user_device_link` ' +
                'ADD COLUMN `created_at` DATETIME NULL AFTER `provision_date`,' +
                'ADD COLUMN `updated_at` DATETIME NULL AFTER `created_at`, ' +
                'ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;',
        );

        queryInterface.sequelize.query(
            'SET FOREIGN_KEY_CHECKS = 0;' +
                'ALTER TABLE `user` MODIFY COLUMN id CHAR(36);' +
                'ALTER TABLE `auth_token` MODIFY COLUMN user_id CHAR(36);' +
                'ALTER TABLE `jobs` MODIFY COLUMN user_id CHAR(36);' +
                'ALTER TABLE `user_device_link` MODIFY COLUMN user_id CHAR(36);' +
                'ALTER TABLE `web_time` MODIFY COLUMN user_id CHAR(36);' +
                'ALTER TABLE `activity` MODIFY COLUMN user_id CHAR(36);' +
                'ALTER TABLE `activity` MODIFY COLUMN teacher_id CHAR(36);' +
                'ALTER TABLE `account_onboarding`  MODIFY COLUMN created_by CHAR(36);' +
                'SET FOREIGN_KEY_CHECKS = 1;',
        );

        queryInterface.sequelize.query('alter table account add column `enable_extension` tinyint(4) DEFAULT 0;');
    },

    async down(queryInterface, Sequelize) {},
};
