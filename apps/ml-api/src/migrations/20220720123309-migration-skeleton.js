'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        queryInterface.sequelize.query(
            'CREATE TABLE `user_onboarding_feedback` (`id` CHAR(36) NOT NULL UNIQUE, `feedback` JSON NOT NULL, `user_id` CHAR(36) NOT NULL, `createdAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;',
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
