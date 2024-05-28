'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table email_event add column google_user_id VARCHAR(50) NULL after user_id`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table email_event drop column google_user_id;`);
  }
};
