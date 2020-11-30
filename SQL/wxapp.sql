/*
 Navicat MySQL Data Transfer

 Source Server         : wxapp
 Source Server Type    : MySQL
 Source Server Version : 50649
 Source Host           : localhost:3306
 Source Schema         : app_morii_top

 Target Server Type    : MySQL
 Target Server Version : 50649
 File Encoding         : 65001

 Date: 30/11/2020 19:28:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback`  (
  `feedback_id` int(11) NOT NULL,
  `feedback_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `feedback_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `img_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `feedback_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`feedback_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES (1, '1', 1, '哇哇哇哇哇', '1', '11', '0000-00-00 00:00:00');

-- ----------------------------
-- Table structure for parameter_configuration
-- ----------------------------
DROP TABLE IF EXISTS `parameter_configuration`;
CREATE TABLE `parameter_configuration`  (
  `test_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `difficulty` int(11) NULL DEFAULT NULL,
  `age_group` int(11) NULL DEFAULT NULL,
  `parameter_info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of parameter_configuration
-- ----------------------------
INSERT INTO `parameter_configuration` VALUES ('S11', 0, 0, '{time:60,level:1}');
INSERT INTO `parameter_configuration` VALUES ('S11', 1, 0, '{time:60,level:2}');
INSERT INTO `parameter_configuration` VALUES ('S11', 2, 0, '{time:60,level:4}');
INSERT INTO `parameter_configuration` VALUES ('S11', 3, 0, '{time:60,level:5}');
INSERT INTO `parameter_configuration` VALUES ('S12', 0, 0, '{time:15}');
INSERT INTO `parameter_configuration` VALUES ('S12', 1, 0, '{time:15}');
INSERT INTO `parameter_configuration` VALUES ('A1', 0, 0, '{longestTime:5,shortestTime:3,interval:0.2,count:10}');
INSERT INTO `parameter_configuration` VALUES ('A1', 1, 0, '{longestTime:2,shortestTime:0.2,interval:0.1,count:20}');
INSERT INTO `parameter_configuration` VALUES ('A2', 0, 0, '{time:30,line:4,column:4}');
INSERT INTO `parameter_configuration` VALUES ('A2', 1, 0, '{time:30,line:5,column:5}');
INSERT INTO `parameter_configuration` VALUES ('A2', 2, 0, '{time:30,line:5,column:5}');
INSERT INTO `parameter_configuration` VALUES ('P', 0, 0, '{time:30,difficulty:3}');
INSERT INTO `parameter_configuration` VALUES ('P', 1, 0, '{time:40,difficulty:4}');
INSERT INTO `parameter_configuration` VALUES ('P', 2, 0, '{time:60,difficulty:5}');
INSERT INTO `parameter_configuration` VALUES ('S21', 0, 0, '{showtime:1.8,maxtime:60}');
INSERT INTO `parameter_configuration` VALUES ('S22', 0, 0, '{showtime:1,maxtime:60}');
INSERT INTO `parameter_configuration` VALUES ('S23', 0, 0, '{showtime:5,maxtime:60}');
INSERT INTO `parameter_configuration` VALUES ('S23', 1, 0, '{showtime:10,maxtime:60}');
INSERT INTO `parameter_configuration` VALUES ('S23', 2, 0, '{showtime:15,maxtime:60}');

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test`  (
  `test_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `test_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`test_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of test
-- ----------------------------
INSERT INTO `test` VALUES ('A1', '寻找数字');
INSERT INTO `test` VALUES ('A2', '接受性注意');
INSERT INTO `test` VALUES ('P', '舒尔特方块');
INSERT INTO `test` VALUES ('S11', '言语加工');
INSERT INTO `test` VALUES ('S12', '渐进矩阵');
INSERT INTO `test` VALUES ('S21', '单词序列');
INSERT INTO `test` VALUES ('S22', '句子提问');
INSERT INTO `test` VALUES ('S23', '记忆广度');

-- ----------------------------
-- Table structure for test_detail
-- ----------------------------
DROP TABLE IF EXISTS `test_detail`;
CREATE TABLE `test_detail`  (
  `test_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `category` int(11) NULL DEFAULT NULL,
  `details` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of test_detail
-- ----------------------------
INSERT INTO `test_detail` VALUES ('S11', 0, '{q:\"qurl\",option:[\"o1url\",\"o2url\",\"o3url\",\"o4url\"],a:1}');
INSERT INTO `test_detail` VALUES ('S12', 0, '{q:\"一个圆形上面有两个三角形\",num:[1,2,0],rule:[[{basic:\"circular\",direction:\"up\",count:2,shape:\"triangle\"}]]}');
INSERT INTO `test_detail` VALUES ('A2', 0, '{src:\"图片在服务器的地址\",detail:\"rabbit\"}');
INSERT INTO `test_detail` VALUES ('A2', 0, '{src:\"图片在服务器的地址\",detail:\"cat\"}');
INSERT INTO `test_detail` VALUES ('A2', 0, '{src:\"图片在服务器的地址\",detail:\"dog\"}');
INSERT INTO `test_detail` VALUES ('A2', 1, '{src:\"图片在服务器的地址\",detail:\"apple\"}');
INSERT INTO `test_detail` VALUES ('A2', 1, '{src:\"图片在服务器的地址\",detail:\"orange\"}');
INSERT INTO `test_detail` VALUES ('A2', 1, '{src:\"图片在服务器的地址\",detail:\"strawberry\"}');
INSERT INTO `test_detail` VALUES ('S21', 0, '{src:\"单字集地址\"}');
INSERT INTO `test_detail` VALUES ('S21', 1, '{src:\"词组集地址\"}');
INSERT INTO `test_detail` VALUES ('S22', 0, '{q:\"qurl\",s:\"surl\",o:[\"o1url\",\"o2url\",\"o3url\",\"o4url\"],a:\"aurl\"}');

-- ----------------------------
-- Table structure for test_result
-- ----------------------------
DROP TABLE IF EXISTS `test_result`;
CREATE TABLE `test_result`  (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `test_order` int(11) NULL DEFAULT NULL COMMENT '用户测试次数',
  `plan_score` double(11, 0) NULL DEFAULT NULL COMMENT '计划得分',
  `plan_rank` int(11) NULL DEFAULT NULL COMMENT '计划排名',
  `attention_score` double(11, 0) NULL DEFAULT NULL,
  `attention_rank` int(11) NULL DEFAULT NULL,
  `simul_score` double(11, 0) NULL DEFAULT NULL,
  `simul_rank` int(11) NULL DEFAULT NULL,
  `suc_score` double(11, 0) NULL DEFAULT NULL,
  `suc_rank` int(11) NULL DEFAULT NULL,
  `cost_time` int(11) NULL DEFAULT NULL COMMENT '测试花费时间',
  `test_date` datetime(0) NULL DEFAULT NULL COMMENT '完成测试日期',
  `sum_people` int(255) NULL DEFAULT NULL COMMENT '当次测试人数',
  `total_score` double(11, 0) NULL DEFAULT NULL,
  `total_rank` int(11) NULL DEFAULT NULL,
  INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of test_result
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `session_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `age` int(4) NULL DEFAULT NULL,
  `gender` int(2) NULL DEFAULT NULL,
  `register_time` datetime(0) NULL DEFAULT NULL,
  `last_login_time` datetime(0) NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `birthday` date NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (7, 'oAkCq5bogxOKNGqFhyEXIjcgOSg4', '16SAMgWPsgbCeR91o06/qw==', NULL, 2, '2020-11-20 14:44:14', '2020-11-20 14:44:14', '酣十六', '2016-11-01');

SET FOREIGN_KEY_CHECKS = 1;
