create database safekids;
CREATE USER 'safekids'@'localhost' IDENTIFIED BY 'safekids';
GRANT ALL PRIVILEGES ON safekids.* TO 'safekids'@'localhost';
