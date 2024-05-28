'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query('' +
        'CREATE TABLE `kid_request` (`id` CHAR(36) NOT NULL, `url` varchar(500) NOT NULL,`category_id` varchar(50) NOT NULL,`access_granted` tinyint(1) NOT NULL DEFAULT 0, `user_id` CHAR(36) NOT NULL,`kid_id` CHAR(36) NOT NULL,`createdAt` datetime NOT NULL,`updatedAt` datetime NOT NULL, PRIMARY KEY (`id`),FOREIGN KEY (`kid_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE) ENGINE=InnoDB;');
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query('' +
        'drop table safekids.kid_request;');
  }
};
