'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
        'parent_consent',
        'is_parent_or_guardian'
    );
    await queryInterface.removeColumn(
        'parent_consent',
        'underage_child_usage'
    );
    await queryInterface.removeColumn(
        'parent_consent',
        'child_information_consent'
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn(
        'parent_consent',
        'is_parent_or_guardian',
        Sequelize.BOOLEAN
    );
    await queryInterface.addColumn(
        'parent_consent',
        'underage_child_usage',
        Sequelize.BOOLEAN
    );
    await queryInterface.addColumn(
        'parent_consent',
        'child_information_consent',
        Sequelize.BOOLEAN
    );
  }
};
