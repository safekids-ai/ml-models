'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table user_opt_in add column onboarding_done TINYINT(1) NULL after email_opt_in_time`);
    queryInterface.sequelize.query(`alter table user_opt_in add column onboarding_time DATETIME NULL after onboarding_done`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table user_opt_in drop column onboarding_done`);
    queryInterface.sequelize.query(`alter table user_opt_in drop column onboarding_time`);
  }
};
