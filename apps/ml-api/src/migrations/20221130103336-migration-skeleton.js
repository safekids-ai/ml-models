'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query('ALTER TABLE `kid_request` MODIFY COLUMN `type` enum("INFORM","INFORM_AI","ASK", "PREVENT")');
        queryInterface.sequelize.query('UPDATE `kid_request` set `type` = "INFORM"');
    },
    async down(queryInterface, Sequelize) {},
};
//ALTER TABLE `safekids`.`kid_request`
// ADD INDEX `updated_at_idx` (`updatedAt` DESC),
// ADD INDEX `request_time_idx` (`request_time` DESC);
// ;
