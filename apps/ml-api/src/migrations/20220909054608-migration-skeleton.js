'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query('INSERT INTO kid_config (id,off_time,user_id,status,step)\n' +
        'SELECT uuid() , \'21:00\', u.id, \'IN_PROGRESS\', 0\n' +
        'FROM user AS u\n' +
        'LEFT JOIN kid_config AS k ON k.user_id  = u.id \n' +
        'WHERE k.ID IS null and u.`role` = \'KID\';');
  },

  async down(queryInterface, Sequelize) {},
};
