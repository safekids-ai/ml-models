'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE account ADD COLUMN on_boarding_step INT NOT NULL DEFAULT 0;');
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
