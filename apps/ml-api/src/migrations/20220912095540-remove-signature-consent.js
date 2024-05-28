'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
        'parent_consent',
        'signature'
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn(
        'parent_consent',
        'signature',
        Sequelize.STRING
    );
  }
};
