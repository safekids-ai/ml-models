'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('alter table `subscription` add COLUMN `coupon` VARCHAR(50) NULL after trial_used');
        queryInterface.sequelize.query('alter table `subscription` add COLUMN `promotion_code` VARCHAR(50) NULL after coupon');
    },
    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query('alter table `subscription` drop COLUMN `coupon`');
        queryInterface.sequelize.query('alter table `subscription` drop COLUMN `promotion_code`');
    },
};
