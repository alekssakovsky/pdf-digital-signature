-- MySQL Script generated by MySQL Workbench
-- Tue Sep 18 14:28:58 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema PDFsign
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `PDFsign` ;

-- -----------------------------------------------------
-- Schema PDFsign
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `PDFsign` DEFAULT CHARACTER SET utf8 ;
USE `PDFsign` ;

-- -----------------------------------------------------
-- Table `PDFsign`.`vendors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PDFsign`.`vendors` (
  `v_id` INT NOT NULL COMMENT 'id vendors table',
  `v_site` VARCHAR(255) NULL DEFAULT NULL COMMENT 'for address',
  PRIMARY KEY (`v_id`),
  UNIQUE INDEX `idtable1_UNIQUE` (`v_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PDFsign`.`customers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PDFsign`.`customers` (
  `c_id` INT NOT NULL AUTO_INCREMENT COMMENT 'id customers table',
  `customerN` VARCHAR(45) NULL COMMENT 'number or name customers',
  `c_vendor_id` INT NOT NULL COMMENT 'relation with id vendors table',
  PRIMARY KEY (`c_id`),
  UNIQUE INDEX `c_id_UNIQUE` (`c_id` ASC),
  INDEX `v_id_idx` (`c_vendor_id` ASC),
  CONSTRAINT `CustomersVendorsFK`
    FOREIGN KEY (`c_vendor_id`)
    REFERENCES `PDFsign`.`vendors` (`v_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PDFsign`.`history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PDFsign`.`history` (
  `h_id` INT NOT NULL AUTO_INCREMENT COMMENT 'id history table',
  `h_customers_id` INT NULL COMMENT 'history of last requests customers id',
  PRIMARY KEY (`h_id`),
  UNIQUE INDEX `h_id_UNIQUE` (`h_id` ASC),
  UNIQUE INDEX `h_customers_id_UNIQUE` (`h_customers_id` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `PDFsign`.`vendors`
-- -----------------------------------------------------
START TRANSACTION;
USE `PDFsign`;
INSERT INTO `PDFsign`.`vendors` (`v_id`, `v_site`) VALUES (1, 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=');

COMMIT;


-- -----------------------------------------------------
-- Data for table `PDFsign`.`customers`
-- -----------------------------------------------------
START TRANSACTION;
USE `PDFsign`;
INSERT INTO `PDFsign`.`customers` (`c_id`, `customerN`, `c_vendor_id`) VALUES (1, 'Arnold', 1);
INSERT INTO `PDFsign`.`customers` (`c_id`, `customerN`, `c_vendor_id`) VALUES (2, 'Stallone', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `PDFsign`.`history`
-- -----------------------------------------------------
START TRANSACTION;
USE `PDFsign`;
INSERT INTO `PDFsign`.`history` (`h_id`, `h_customers_id`) VALUES (1, 0);

COMMIT;

