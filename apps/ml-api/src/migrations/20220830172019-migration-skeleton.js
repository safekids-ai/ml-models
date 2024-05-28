'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            '' + 'alter table `filtered_category` add column `status` varchar(50) NOT NULL, ' + ' add column `time_duration` int(11) DEFAULT NULL;',
        );
        queryInterface.sequelize.query(
            '' + 'alter table `category` add column `status` varchar(50) NOT NULL,' + 'add column `time_duration` int(11) DEFAULT NULL;',
        );
        queryInterface.sequelize.query(
            'CREATE TABLE `kid_config` (`id` CHAR(36) NOT NULL, `off_time` varchar(50) DEFAULT NULL, `user_id` CHAR(36) NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;',
        );
    },

    async down(queryInterface, Sequelize) {},
};
