'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`create table \`subscription-feedback\` (\`id\` CHAR(36) not null ,
                                    \`feedback\` JSON not null,
                                    \`account_id\` CHAR(36) binary not null,
                                    \`created_at\` DATETIME,
                                    \`updated_at\` DATETIME,
                                    \`deleted_at\` DATETIME,
                                    primary key (\`id\`),
                                    foreign key (\`account_id\`) references \`account\` (\`id\`) on delete no action on update cascade)
                                    engine = InnoDB;`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`drop table subscription-feedback;`);
  }
};
