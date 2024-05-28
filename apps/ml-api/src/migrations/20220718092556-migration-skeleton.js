'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`alter table category add column schoolDefault tinyint(1) DEFAULT 0;`);
        queryInterface.sequelize.query(`alter table category add column consumerDefault tinyint(1) DEFAULT 0;`);
        queryInterface.sequelize.query(`alter table category add column editable tinyint(1) DEFAULT 0;`);
        queryInterface.sequelize.query(`UPDATE account SET account_type_id='SCHOOL' WHERE account_type_id is NULL;`);
    },

    async down(queryInterface, Sequelize) {},
};
