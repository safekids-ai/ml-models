'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('update `user`\n' + "set role='STUDENT' where role is null;");

        queryInterface.sequelize.query('ALTER TABLE `user`\n' + 'ADD INDEX `user_role_fk_idx` (`role` ASC);');

        queryInterface.sequelize.query(
            'ALTER TABLE `user` \n' +
                'ADD CONSTRAINT `user_role_fk`  FOREIGN KEY (`role`) REFERENCES `role` (`id`)\n' +
                '  ON DELETE NO ACTION\n' +
                '  ON UPDATE NO ACTION;',
        );

        queryInterface.sequelize.query('ALTER TABLE filtered_url CHANGE name url varchar(200);');
        queryInterface.sequelize.query("UPDATE user set status_id='ACTIVE' where status_id is null");

        let tableNames = ['user', 'activity', 'device'];
        let columns = ['created_at', 'updated_at', 'deleted_at'];

        for (const tableName of tableNames) {
            let def = await queryInterface.describeTable(tableName);
            for (const column of columns) {
                if (!def[column]) {
                    queryInterface.sequelize.query(`ALTER TABLE ${tableName}
                        ADD COLUMN ${column} DATETIME;`);
                }
            }
        }
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE filtered_url CHANGE url name varchar(100);');
    },
};
