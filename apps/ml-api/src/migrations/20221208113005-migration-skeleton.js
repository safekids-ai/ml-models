'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            'CREATE TABLE `filtered_process` (`id` CHAR(36) BINARY , `name` VARCHAR(150) NOT NULL, `org_unit_id` CHAR(36) BINARY, `account_id` CHAR(36) BINARY NOT NULL, `is_allowed` TINYINT(1) NOT NULL DEFAULT true, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`org_unit_id`) REFERENCES `organization_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;'
        );
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('DROP TABLE `filtered_process`');
    },
};
