'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`alter table user add column year_of_birth varchar(4) DEFAULT NULL;`);
    },

    async down(queryInterface, Sequelize) {},
};
