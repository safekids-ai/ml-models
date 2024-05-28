'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('alter table user add column `access_code` varchar(6)');
        queryInterface.sequelize.query('ALTER TABLE `user` DROP INDEX id;');
        queryInterface.sequelize.query(
            'CREATE TABLE `parent_consent` (\n' +
                '  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,\n' +
                '  `user_id` char(36) NOT NULL,\n' +
                '  `account_id` char(36) NOT NULL,\n' +
                '  `has_legal_authority_to_install` tinyint(1) NOT NULL,\n' +
                '  `is_parent_or_guardian` tinyint(1) NOT NULL,\n' +
                '  `underage_child_usage` tinyint(1) NOT NULL,\n' +
                '  `child_information_consent` tinyint(1) NOT NULL,\n' +
                '  `bound_by_privacy_policy` tinyint(1) NOT NULL,\n' +
                '  `signature` varchar(255) NOT NULL,\n' +
                '  `createdAt` datetime NOT NULL,\n' +
                '  `updatedAt` datetime NOT NULL,\n' +
                '  `deletedAt` datetime DEFAULT NULL,\n' +
                '  PRIMARY KEY (`id`),\n' +
                '  KEY `user_id` (`user_id`),\n' +
                '  KEY `account_id` (`account_id`)\n' +
                ') ENGINE=InnoDB DEFAULT CHARSET=latin1',
        );
        queryInterface.sequelize.query(
            'CREATE TABLE `user_code` (\n' +
                '  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,\n' +
                '  `user_id` char(36) NOT NULL,\n' +
                "  `code_type` enum('EMAIL','PASSWORD','SMS') NOT NULL,\n" +
                '  `code` varchar(255) NOT NULL,\n' +
                '  `createdAt` datetime NOT NULL,\n' +
                '  `updatedAt` datetime NOT NULL,\n' +
                '  `deletedAt` datetime DEFAULT NULL,\n' +
                '  PRIMARY KEY (`id`),\n' +
                '  UNIQUE KEY `id` (`id`),\n' +
                '  KEY `user_id` (`user_id`)\n' +
                ') ENGINE=InnoDB DEFAULT CHARSET=latin1',
        );
    },

    async down(queryInterface, Sequelize) {},
};
