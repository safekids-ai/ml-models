'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query('' +
        'ALTER TABLE `kid_config` add column `status` varchar(50) DEFAULT NULL,' +
        'add column `step` int(11) DEFAULT NULL;');
  },

  async down(queryInterface, Sequelize) {},
};
