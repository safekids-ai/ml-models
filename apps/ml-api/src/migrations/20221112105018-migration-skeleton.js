'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`ALTER TABLE account add column notify_expired_extension tinyint(1) DEFAULT 0;`);
        queryInterface.sequelize.query(`ALTER TABLE account add column stripe_customer_id varchar(255) DEFAULT NULL;`);
        queryInterface.sequelize.query(`CREATE TABLE \`plan\` (\`id\` CHAR(36) NOT NULL ,
                                        \`name\` VARCHAR(255) NOT NULL,
                                        \`price\` VARCHAR(255) NOT NULL,
                                        \`price_id\` VARCHAR(255) NOT null UNIQUE,
                                        \`product_id\` VARCHAR(255) NOT null UNIQUE,
                                        \`tenure\` ENUM('YEAR', 'MONTH', 'FREE') NOT NULL,
                                        \`currency\` VARCHAR(255) NOT NULL,
                                        \`trial_period\` INTEGER NOT NULL,
                                        \`plan_type\` ENUM('YEARLY', 'MONTHLY', 'FREE') NOT NULL,
                                        \`created_at\` DATETIME NOT NULL,
                                        \`updated_at\` DATETIME NOT NULL,
                                        \`deleted_at\` DATETIME, PRIMARY KEY (\`id\`)) ENGINE=InnoDB;`);
        queryInterface.sequelize.query(`CREATE TABLE \`subscription\` (
                                        \`id\` CHAR(36) NOT NULL ,
                                        \`account_id\` CHAR(36) BINARY  NOT NULL UNIQUE,
                                        \`plan_id\` CHAR(36)  NOT NULL,
                                        \`trial_start_time\` DATETIME NOT NULL,
                                        \`trial_end_time\` DATETIME NOT NULL,
                                        \`trial_used\` TINYINT(1) NOT NULL,
                                        \`sub_start_time\` DATETIME NOT NULL,
                                        \`sub_end_time\` DATETIME NOT NULL,
                                        \`status\` VARCHAR(255) NOT NULL,
                                        \`cancel_at_period_end\` TINYINT(1),
                                        \`created_at\` DATETIME NOT NULL,
                                        \`updated_at\` DATETIME NOT NULL,
                                        \`deleted_at\` DATETIME NOT NULL,
                                        PRIMARY KEY (\`id\`),
                                        FOREIGN KEY (\`account_id\`) REFERENCES \`account\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE,
                                        FOREIGN KEY (\`plan_id\`) REFERENCES \`plan\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE)
                                        ENGINE=InnoDB;`);
        queryInterface.sequelize.query(`CREATE TABLE \`payment\` (
                                        \`id\` CHAR(36) NOT NULL ,
                                        \`account_id\` CHAR(36) BINARY NOT NULL ,
                                        \`payment_method_id\` VARCHAR(255) NOT NULL UNIQUE,
                                        \`last_digits\` VARCHAR(255) NOT NULL,
                                        \`expiry_month\` INTEGER NOT NULL, 
                                        \`expiry_year\` INTEGER NOT NULL,
                                        \`created_at\` DATETIME NOT NULL,
                                        \`updated_at\` DATETIME NOT NULL, 
                                        \`deleted_at\` DATETIME,
                                        PRIMARY KEY (\`id\`),
                                        FOREIGN KEY (\`account_id\`) REFERENCES \`account\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE)
                                        ENGINE=InnoDB;`);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`ALTER TABLE account DROP COLUMN notify_expired_extension;`);
        queryInterface.sequelize.query(`ALTER TABLE account DROP COLUMN stripe_customer_id;`);
        queryInterface.sequelize.query(`drop table plan;`);
        queryInterface.sequelize.query(`drop table subscription;`);
        queryInterface.sequelize.query(`drop table payment;`);
    },
};
