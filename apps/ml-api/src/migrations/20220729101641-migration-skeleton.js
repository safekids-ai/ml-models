'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            'update\n' +
                '\tuser as u\n' +
                'inner join organization_unit ou on\n' +
                '\tou.id = u.org_unit_id\n' +
                'inner join account a on\n' +
                '\ta.id = u.account_id\n' +
                'set\tou.google_org_unit_id = concat("id:" , u.access_code) \n' +
                'where\n' +
                "\ta.account_type_id = 'CONSUMER'\n" +
                "\tand u.`role` = 'KID'\n" +
                '\tand ou.parent is not null;',
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
