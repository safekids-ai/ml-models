'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`create table if not exists \`invoice\` (\`id\` CHAR(36) binary not null ,
\`account_id\` CHAR(36) binary not null unique,
\`subscription_id\` CHAR(36) not null UNIQUE,
\`next_payment_date\` DATETIME,
\`total_price\` VARCHAR(255),
\`after_promo\` VARCHAR(255),
\`amount_paid\` VARCHAR(255),
\`amount_due\` VARCHAR(255),
\`amount_remaining\` VARCHAR(255), 
\`createdAt\` DATETIME not null,
\`updatedAt\` DATETIME not null,
primary key (\`id\`),
foreign key (\`account_id\`) references \`account\` (\`id\`) on delete no action on\tupdate\tcascade,
foreign key (\`subscription_id\`) references \`subscription\` (\`id\`) on\tdelete no action on\tupdate cascade)
engine = InnoDB;`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`drop table invoice`);
  }
};
