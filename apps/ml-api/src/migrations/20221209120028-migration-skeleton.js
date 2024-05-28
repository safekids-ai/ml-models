'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query('create table if not exists `health` (`id` CHAR(36) binary not null ,\n' +
        '`name` VARCHAR(255) not null,\n' +
        'primary key (`id`)) engine = InnoDB;');
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query('DROP TABLE `health`');
  }
};
