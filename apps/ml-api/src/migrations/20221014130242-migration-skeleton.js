'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table activity add COLUMN event_id VARCHAR(50) NULL after web_activity_type_id`);
    queryInterface.sequelize.query(`alter table activity add UNIQUE INDEX event_id_unique (event_id ASC)`);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`alter table activity drop column event_id`);
    queryInterface.sequelize.query(`alter table activity drop index event_id_unique`);
  }
};
