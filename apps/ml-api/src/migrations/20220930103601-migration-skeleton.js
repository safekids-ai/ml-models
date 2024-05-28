'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query('' +
        'INSERT INTO `account` (`id`,`name`,`account_type_id`,`primary_domain`,`onboarding_status_id`,`enable_extension`,`created_at`,`updated_at`)\n' +
        'VALUES ("7482b020-08a8-4771-ade6-5ed98794c802", "e2e-test-account", "CONSUMER", "e2e-test-account@gmail.com", "IN_PROGRESS", false, now(), now());');

    queryInterface.sequelize.query('' +
        'INSERT INTO `organization_unit` (`id`,`google_org_unit_id`,`name`,`org_unit_path`,`account_id`) \n' +
        'VALUES ("2251e9d7-5ec0-4ced-a211-87fd498ec708", "id:e2e-test-account@gmail.com", "All", "/", "7482b020-08a8-4771-ade6-5ed98794c802");');

    queryInterface.sequelize.query('' +
        'INSERT INTO `filtered_category` (`id`,`name`,`enabled`,`category_id`,`org_unit_id`,`account_id`,`status`,`time_duration`)\n' +
        'VALUES (\'3885a59c-9882-4710-8e31-ea9b3b1d3e50\',\'Adult Sexual Content\',true,\'ADULT_SEXUAL_CONTENT\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL)\n' +
        ',(\'898d8db5-bc0e-4cfb-bcf7-5788ccd2406a\',\'Body Image/Related to Disordered Eating\',true,\'BODY_IMAGE\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL)\n' +
        ',(\'8f94a48f-714d-4670-b603-aee534f879fe\',\'Clothing, Fashion and Jewelry\',false,\'CLOTHING_FASHION_JEWELRY\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL)\n' +
        ',(\'02d76cb6-6b23-4ecf-a666-040463530122\',\'Criminal/Malicious\',true,\'CRIMINAL_MALICIOUS\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'f4c89da8-5e44-41b0-bde3-b7758297a32e\',\'Drugs, Alcohol, or Tobacco Related\',true,\'DRUGS_ALCOHOL_TOBACCO\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'1a4907a8-755a-4e8b-aec4-6ebf8489d2d9\',\'Entertainment News and Streaming\',true,\'ENTERTAINMENT_NEWS_STREAMING\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'INFORM\',NULL),\n' +
        '(\'a9f487b1-e1e1-4501-b890-211b052ac4ba\',\'Fake News\',true,\'FAKE_NEWS\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'f18ba0d5-ce03-4d5b-8025-d6e7853d63e8\',\'Gambling\',true,\'GAMBLING\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'a4a6badd-c344-473b-9d39-0451725eb970\',\'Hate Speech\',true,\'HATE_SPEECH\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'5928a5a6-dc23-45cf-a32e-34dc5796f370\',\'Inappropriate for Minors\',true,\'INAPPROPRIATE_FOR_MINORS\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'5c64f7eb-38a3-4211-b9bf-0d1b36637e4d\',\'Online Gaming\',true,\'ONLINE_GAMING\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'INFORM\',30),\n' +
        '(\'1f102c2a-599f-435d-9da9-53357400483c\',\'Self Harm/Suicidal Content\',true,\'SELF_HARM_SUICIDAL_CONTENT\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'da6bfba1-b630-4243-bf75-5b49bedb69ad\',\'Sex Education\',false,\'SEX_EDUCATION\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL),\n' +
        '(\'3eae5ed0-58ab-42f1-b0e1-e4a11e7b5492\',\'Shopping and Product Reviews\',false,\'SHOPPING_PRODUCT_REVIEWS\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL),\n' +
        '(\'d2f73d30-4883-4484-bfb3-05f91c473889\',\'Social Media and Chat\',true,\'SOCIAL_MEDIA_CHAT\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ASK\',NULL),\n' +
        '(\'5e71ad16-613b-4ba6-9dde-0ddb32156be5\',\'Violence\',true,\'VIOLENCE\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'d20edb41-d155-4a0e-88aa-9c111139c986\',\'Weapons\',true,\'WEAPONS\',\'2251e9d7-5ec0-4ced-a211-87fd498ec708\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL);');

    queryInterface.sequelize.query('' +
        'INSERT INTO `user` (`id`,`first_name`,`last_name`,`primary_email`,`password`,`is_admin`,`is_delegated_admin`,`agreed_to_terms`,`org_unit_id`,`account_id`,`role`,`status_id`,`access_limited`,`created_at`,`updated_at`) \n' +
        'VALUES ("93ac93a4-1464-4ee4-b15a-f1d20d570d41", "e2e-test", "account", "e2e-test-account@gmail.com", "$2b$04$dJQg68OOx0.IfCjvrEwt4ebAYUce75A/T4MdiZNRjxqrX.n3PMh6O", "0", "0", "0", "2251e9d7-5ec0-4ced-a211-87fd498ec708",\n' +
        '"7482b020-08a8-4771-ade6-5ed98794c802", "PARENT", "ACTIVE", false, now(), now());');

    queryInterface.sequelize.query('' +
        'INSERT INTO `user_code` (`id`,`user_id`,`code_type`,`code`,`createdAt`,`updatedAt`) \n' +
        'VALUES ("f5aa8b2a-1b20-4af1-93de-df331ec0ffa3", "93ac93a4-1464-4ee4-b15a-f1d20d570d41", "EMAIL", "111111", now(), now());');

    queryInterface.sequelize.query('' +
        'INSERT INTO `organization_unit` (`id`,`google_org_unit_id`,`name`,`parent`,`org_unit_path`,`parent_ou_id`,`account_id`) \n' +
        'VALUES ("d0e62c13-6f31-419b-8ebd-520a076b482c", "id:112233", "kid1 kid1", "/", "/kid1 kid1", "id:e2e-test-account@gmail.com", "7482b020-08a8-4771-ade6-5ed98794c802");');

    queryInterface.sequelize.query('' +
        'INSERT INTO `filtered_category` (`id`,`name`,`enabled`,`category_id`,`org_unit_id`,`account_id`,`status`,`time_duration`)\n' +
        'VALUES (\'f5d9766b-d172-46fc-b4f4-5a7e219e68a0\',\'Adult Sexual Content\',true,\'ADULT_SEXUAL_CONTENT\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'d481d2bf-57bb-4987-b7c5-f79e340f7118\',\'Body Image/Related to Disordered Eating\',true,\'BODY_IMAGE\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'33a4998f-3e74-4519-8ed6-2f99b979235e\',\'Clothing, Fashion and Jewelry\',false,\'CLOTHING_FASHION_JEWELRY\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL),\n' +
        '(\'bc39cfc8-17b7-4842-b9a0-51eb3f46daa4\',\'Criminal/Malicious\',true,\'CRIMINAL_MALICIOUS\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'9cfa61c1-0fdb-4ae1-9836-bcaf5e2382a6\',\'Drugs, Alcohol, or Tobacco Related\',true,\'DRUGS_ALCOHOL_TOBACCO\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'68624238-af2e-4dd4-91c2-fe02314043ad\',\'Entertainment News and Streaming\',true,\'ENTERTAINMENT_NEWS_STREAMING\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'INFORM\',NULL),\n' +
        '(\'c076de18-af0d-4767-8040-b410a67fcaf9\',\'Fake News\',true,\'FAKE_NEWS\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'2bd75140-d911-4810-97a8-22e79a974b11\',\'Gambling\',true,\'GAMBLING\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'042cf32f-05e3-472c-a1e4-720f240ef54f\',\'Hate Speech\',true,\'HATE_SPEECH\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'597d7a56-8220-4a46-8cd2-5e3e4fe6f628\',\'Inappropriate for Minors\',true,\'INAPPROPRIATE_FOR_MINORS\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'02ddbf73-94ad-487e-bd2a-dd7713aeb300\',\'Online Gaming\',true,\'ONLINE_GAMING\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'INFORM\',30),\n' +
        '(\'f429b569-f6d0-47ae-8c86-75ae43ea4609\',\'Self Harm/Suicidal Content\',true,\'SELF_HARM_SUICIDAL_CONTENT\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'678f61e8-d3c6-4ca5-9096-ca17624cdb8d\',\'Sex Education\',false,\'SEX_EDUCATION\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL),\n' +
        '(\'5dd4037b-b380-4467-9505-291672c63bc5\',\'Shopping and Product Reviews\',false,\'SHOPPING_PRODUCT_REVIEWS\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ALLOW\',NULL),\n' +
        '(\'5536f599-5f8f-4a0f-9d1f-13ca0aaacd68\',\'Social Media and Chat\',true,\'SOCIAL_MEDIA_CHAT\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'ASK\',NULL),\n' +
        '(\'d624e089-45b9-4668-913b-824f0a973834\',\'Violence\',true,\'VIOLENCE\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL),\n' +
        '(\'dfddeb51-faec-4eb7-9422-873407978ebf\',\'Weapons\',true,\'WEAPONS\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',\'PREVENT\',NULL);');

    queryInterface.sequelize.query('' +
        'INSERT INTO `user` (`id`,`first_name`,`last_name`,`primary_email`,`access_code`,`year_of_birth`,`is_admin`,`is_delegated_admin`,`agreed_to_terms`,\n' +
        '`org_unit_id`,`account_id`,`role`,`status_id`,`access_limited`,`created_at`,`updated_at`)VALUES ("eca9f781-bfa5-4b37-ac4f-1f945b871e15",\n' +
        '"kid1", "kid1", "kid1_kid1:e2e-test-account@gmail.com", "112233", "2000", "0", "0", "0", "d0e62c13-6f31-419b-8ebd-520a076b482c",\n' +
        '"7482b020-08a8-4771-ade6-5ed98794c802", "KID", "INACTIVE", false, now(), now());');

    queryInterface.sequelize.query('' +
        'INSERT INTO `kid_config` (`id`,`off_time`,`user_id`,`status`,`step`) \n' +
        'VALUES ("a14533e9-2639-42df-8e50-5b9f694198ac", "21:00", "eca9f781-bfa5-4b37-ac4f-1f945b871e15", "IN_PROGRESS", 0);');

    queryInterface.sequelize.query('' +
        'INSERT INTO `filtered_url` (`id`,`url`,`org_unit_id`,`account_id`,`enabled`,`inherit_from_parent`)\n' +
        'VALUES (\'a3c43305-a3ec-4ae9-ae08-b4b8084ea1b0\',\'instagram.com\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',true,true),\n' +
        '(\'78d26c5f-d7e4-4cd8-a29c-1dab67bc557a\',\'amazon.com\',\'d0e62c13-6f31-419b-8ebd-520a076b482c\',\'7482b020-08a8-4771-ade6-5ed98794c802\',true,true);');
  },

  async down (queryInterface, Sequelize) {
  }
};
