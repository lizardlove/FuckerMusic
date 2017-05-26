/*
Navicat MySQL Data Transfer

Source Server         : adsad
Source Server Version : 50718
Source Host           : 112.74.41.129:3306
Source Database       : fucker

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-05-20 18:45:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for barrage
-- ----------------------------
DROP TABLE IF EXISTS `barrage`;
CREATE TABLE `barrage` (
  `id` int(11) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `music_id` int(11) DEFAULT NULL,
  `time` double DEFAULT NULL,
  `x` int(255) DEFAULT NULL,
  `y` int(255) DEFAULT NULL,
  `fontSize` int(11) DEFAULT NULL,
  `fontColor` varchar(255) DEFAULT NULL,
  `fontFamily` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `masterU` int(255) DEFAULT NULL,
  `friendU` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for music_list
-- ----------------------------
DROP TABLE IF EXISTS `music_list`;
CREATE TABLE `music_list` (
  `uid` int(11) DEFAULT NULL,
  `sort` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `music_id` int(11) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `nick` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `head` varchar(255) DEFAULT NULL,
  `fontSize` int(11) DEFAULT NULL,
  `fontColor` varchar(255) DEFAULT NULL,
  `fontFamily` varchar(255) DEFAULT NULL,
  `verif` int(255) DEFAULT NULL,
  `list` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
