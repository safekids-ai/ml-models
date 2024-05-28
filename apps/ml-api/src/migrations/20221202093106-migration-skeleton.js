'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code DROP COLUMN link;');
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code MODIFY COLUMN expires_at datetime DEFAULT NULL;');
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code ADD COLUMN times_redeemed INT NOT NULL DEFAULT 0;');
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code DROP COLUMN times_redeemed;');
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code MODIFY COLUMN expires_at datetime NOT NULL;');
    queryInterface.sequelize.query('ALTER TABLE referral_promo_code add column link varchar(250) DEFAULT NULL;');
  }
};
