'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table category drop column consumerDefault ;`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table category add column consumerDefault tinyint(1) DEFAULT 0;`);
  }
};
