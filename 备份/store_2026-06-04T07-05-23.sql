-- MySQL dump 10.13  Distrib 5.7.26, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: store
-- ------------------------------------------------------
-- Server version	5.7.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `consignee` varchar(255) NOT NULL COMMENT '收货人姓名',
  `phone` varchar(255) NOT NULL COMMENT '电话号码',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `is_default` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为默认地址',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `area_name` varchar(255) NOT NULL COMMENT '所在地区名称',
  `area_code` varchar(100) NOT NULL COMMENT '所在地区代码',
  `tag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '标签（0：家、1：公司、2：学校）',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'张三','13800138000','某某街道某某大厦101',1,'2026-05-30 08:01:54','2026-05-30 08:01:54','广东省 深圳市 南山区','440305',0),(2,1,'李四','13911112222','某某路88号',0,'2026-05-30 08:01:54','2026-05-30 08:01:54','北京市 北京市 朝阳区','110105',1),(3,17,'吴东宇','15790488034','测试',1,'2026-05-30 08:06:04','2026-05-30 08:20:51','海南 海口 龙华','000000',1);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `goods_id` int(11) NOT NULL COMMENT '商品ID',
  `number` int(11) NOT NULL DEFAULT '1' COMMENT '商品数量',
  `selected` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否选中',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `specs` varchar(255) DEFAULT NULL COMMENT '规格快照 (JSON 或字符串)',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `goods_id` (`goods_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COMMENT='用户购物车表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (9,17,28,4,1,'2026-06-01 10:07:52','2026-06-03 06:14:40',NULL),(13,17,41,1,1,'2026-06-02 08:57:42','2026-06-02 08:57:42','霸王桶,七分糖,常规冰,标准牛奶'),(14,17,46,1,1,'2026-06-02 09:00:54','2026-06-02 09:00:54','霸王桶,七分糖,无'),(20,17,46,1,1,'2026-06-02 09:06:44','2026-06-02 09:06:44','中杯,全糖,珍珠,椰果,布丁,红豆'),(21,17,41,1,1,'2026-06-02 09:06:56','2026-06-02 09:06:56','霸王桶,全糖,去冰,燕麦奶'),(22,17,46,1,1,'2026-06-02 09:07:23','2026-06-02 09:07:23','全糖,椰果,布丁,红豆'),(23,17,41,1,1,'2026-06-02 09:07:23','2026-06-02 09:07:23','全糖,去冰,燕麦奶,霸王桶,椰果,布丁,红豆'),(26,17,41,1,1,'2026-06-02 09:11:54','2026-06-02 09:11:54','霸王桶,全糖,常规冰,厚椰乳'),(27,17,41,5,1,'2026-06-02 09:12:16','2026-06-02 09:49:04','七分糖,常规冰,标准牛奶,中杯'),(28,17,41,4,1,'2026-06-02 09:12:16','2026-06-02 09:27:11','全糖,常规冰,厚椰乳,霸王桶'),(31,17,41,1,1,'2026-06-02 09:47:37','2026-06-02 09:47:37','中杯,七分糖,常规冰,标准牛奶'),(32,17,41,1,1,'2026-06-02 09:49:27','2026-06-02 09:49:27','中杯,七分糖,常规冰,燕麦奶'),(33,17,41,2,1,'2026-06-02 09:50:46','2026-06-03 05:35:42','七分糖,常规冰,燕麦奶,中杯'),(34,17,46,3,1,'2026-06-03 05:36:12','2026-06-03 05:36:16','中杯,七分糖,无'),(35,17,46,1,1,'2026-06-03 05:37:17','2026-06-03 05:37:17','中杯,七分糖,无,珍珠'),(36,17,46,1,1,'2026-06-03 05:37:54','2026-06-03 05:37:54','七分糖,中杯,无,珍珠'),(38,17,44,1,1,'2026-06-03 06:13:12','2026-06-03 06:13:12','中杯,七分糖,常规冰'),(42,17,9,1,1,'2026-06-03 06:30:59','2026-06-03 06:30:59',NULL),(43,17,43,1,1,'2026-06-03 06:50:05','2026-06-03 06:50:05','七分糖,常规冰,中杯'),(44,17,20,1,1,'2026-06-04 06:29:09','2026-06-04 06:29:09','中杯,七分糖,常规冰'),(45,17,45,1,1,'2026-06-04 06:44:19','2026-06-04 06:44:19','霸王桶,常规冰');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `casbin_rule`
--

DROP TABLE IF EXISTS `casbin_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `casbin_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ptype` varchar(255) DEFAULT NULL,
  `v0` varchar(255) DEFAULT NULL,
  `v1` varchar(255) DEFAULT NULL,
  `v2` varchar(255) DEFAULT NULL,
  `v3` varchar(255) DEFAULT NULL,
  `v4` varchar(255) DEFAULT NULL,
  `v5` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casbin_rule`
--

LOCK TABLES `casbin_rule` WRITE;
/*!40000 ALTER TABLE `casbin_rule` DISABLE KEYS */;
INSERT INTO `casbin_rule` VALUES (1,'p','admin','/dashboard','view',NULL,NULL,NULL),(2,'p','admin','/user_manage','view',NULL,NULL,NULL),(3,'p','admin','/category_manage','view',NULL,NULL,NULL),(4,'p','admin','/goods_manage','view',NULL,NULL,NULL),(5,'p','admin','/order_manage','view',NULL,NULL,NULL),(6,'p','admin','/address_manage','view',NULL,NULL,NULL),(7,'p','admin','/store_manage','view',NULL,NULL,NULL),(8,'p','admin','/system','view',NULL,NULL,NULL),(9,'p','admin','/system/role','view',NULL,NULL,NULL),(10,'p','admin','/system/menu','view',NULL,NULL,NULL),(11,'p','admin','/system/notice','view',NULL,NULL,NULL),(12,'p','admin','goods:add_btn','use',NULL,NULL,NULL),(13,'p','admin','goods:edit_btn','use',NULL,NULL,NULL),(14,'p','admin','goods:delete_btn','use',NULL,NULL,NULL),(15,'p','admin','user:assign_role_btn','use',NULL,NULL,NULL),(16,'p','admin','role:assign_perm_btn','use',NULL,NULL,NULL),(17,'p','admin','/goods/','GET',NULL,NULL,NULL),(18,'p','admin','/goods/','POST',NULL,NULL,NULL),(19,'p','admin','/goods/:id','PUT',NULL,NULL,NULL),(20,'p','admin','/goods/off','POST',NULL,NULL,NULL),(21,'p','admin','/goods/on','POST',NULL,NULL,NULL),(22,'p','admin','/goods/removal','POST',NULL,NULL,NULL),(23,'p','admin','/category/','GET',NULL,NULL,NULL),(24,'p','admin','/category/','POST',NULL,NULL,NULL),(25,'p','admin','/category/:id','PUT',NULL,NULL,NULL),(26,'p','admin','/category/:id','DELETE',NULL,NULL,NULL),(27,'p','admin','/category/:id/goods','POST',NULL,NULL,NULL),(28,'p','admin','/category/:id/goods','DELETE',NULL,NULL,NULL),(29,'p','admin','/order','POST',NULL,NULL,NULL),(30,'p','admin','/order/:id','DELETE',NULL,NULL,NULL),(31,'p','admin','/order/:id','PATCH',NULL,NULL,NULL),(32,'p','admin','/address/findAll','POST',NULL,NULL,NULL),(33,'p','admin','/store/list','GET',NULL,NULL,NULL),(34,'p','admin','/store','POST',NULL,NULL,NULL),(35,'p','admin','/store/:id','PUT',NULL,NULL,NULL),(36,'p','admin','/store/:id','DELETE',NULL,NULL,NULL),(37,'p','admin','/tj/summary','GET',NULL,NULL,NULL),(38,'p','admin','/tj/user-count','POST',NULL,NULL,NULL),(39,'p','admin','/tj/goods-count','POST',NULL,NULL,NULL),(40,'p','admin','/tj/order-count','POST',NULL,NULL,NULL),(41,'p','admin','/user/all','POST',NULL,NULL,NULL),(42,'p','admin','/user/add','POST',NULL,NULL,NULL),(43,'p','admin','/user/:id','DELETE',NULL,NULL,NULL),(44,'p','admin','/notice/list','POST',NULL,NULL,NULL),(45,'p','admin','/notice','POST',NULL,NULL,NULL),(46,'p','admin','/notice/:id','PUT',NULL,NULL,NULL),(47,'p','admin','/notice/:id','DELETE',NULL,NULL,NULL),(48,'p','admin','*','*',NULL,NULL,NULL),(49,'p','admin','goods:edit_store','use',NULL,NULL,NULL),(50,'p','admin','/coupon_manage','view',NULL,NULL,NULL),(51,'p','admin','coupon:add_btn','use',NULL,NULL,NULL),(52,'p','admin','coupon:edit_btn','use',NULL,NULL,NULL),(53,'p','admin','/tj/sales-trend','GET',NULL,NULL,NULL),(54,'p','admin','/tj/category-distribution','GET',NULL,NULL,NULL),(55,'p','admin','/tj/recent-orders','GET',NULL,NULL,NULL),(56,'p','admin','/coupon/template','GET',NULL,NULL,NULL),(57,'p','admin','/coupon/template','POST',NULL,NULL,NULL),(58,'p','admin','/coupon/template/:id','PUT',NULL,NULL,NULL),(59,'p','admin','/coupon/template/:id','DELETE',NULL,NULL,NULL),(60,'p','admin','/coupon/template/:id/records','GET',NULL,NULL,NULL),(61,'p','admin','/checkin_manage','view',NULL,NULL,NULL),(62,'p','admin','/checkin/rewards','GET',NULL,NULL,NULL),(63,'p','admin','/checkin/rewards','PUT',NULL,NULL,NULL),(64,'p','admin','/checkin/records','GET',NULL,NULL,NULL),(65,'p','manager','/user_manage','view',NULL,NULL,NULL),(66,'p','manager','/category_manage','view',NULL,NULL,NULL),(67,'p','manager','/goods_manage','view',NULL,NULL,NULL),(68,'p','manager','/order_manage','view',NULL,NULL,NULL),(69,'p','manager','/system','view',NULL,NULL,NULL),(70,'p','manager','/system/notice','view',NULL,NULL,NULL),(71,'p','manager','goods:add_btn','use',NULL,NULL,NULL),(72,'p','manager','goods:edit_btn','use',NULL,NULL,NULL),(73,'p','manager','goods:delete_btn','use',NULL,NULL,NULL),(74,'p','manager','user:assign_role_btn','use',NULL,NULL,NULL),(75,'p','manager','/goods/','GET',NULL,NULL,NULL),(76,'p','manager','/goods/','POST',NULL,NULL,NULL),(77,'p','manager','/goods/:id','PUT',NULL,NULL,NULL),(78,'p','manager','/goods/off','POST',NULL,NULL,NULL),(79,'p','manager','/goods/on','POST',NULL,NULL,NULL),(80,'p','manager','/goods/removal','POST',NULL,NULL,NULL),(81,'p','manager','/category/','GET',NULL,NULL,NULL),(82,'p','manager','/category/','POST',NULL,NULL,NULL),(83,'p','manager','/category/:id','PUT',NULL,NULL,NULL),(84,'p','manager','/category/:id','DELETE',NULL,NULL,NULL),(85,'p','manager','/category/:id/goods','POST',NULL,NULL,NULL),(86,'p','manager','/category/:id/goods','DELETE',NULL,NULL,NULL),(87,'p','manager','/order','POST',NULL,NULL,NULL),(88,'p','manager','/order/:id','DELETE',NULL,NULL,NULL),(89,'p','manager','/order/:id','PATCH',NULL,NULL,NULL),(90,'p','manager','/user/all','POST',NULL,NULL,NULL),(91,'p','manager','/user/add','POST',NULL,NULL,NULL),(92,'p','manager','/user/:id','DELETE',NULL,NULL,NULL),(93,'p','manager','/notice/list','POST',NULL,NULL,NULL),(94,'p','manager','/notice','POST',NULL,NULL,NULL),(95,'p','manager','/notice/:id','PUT',NULL,NULL,NULL),(96,'p','manager','/notice/:id','DELETE',NULL,NULL,NULL),(97,'p','manager','goods:edit_store','use',NULL,NULL,NULL),(98,'p','staff','/dashboard','view',NULL,NULL,NULL),(99,'p','staff','/goods_manage','view',NULL,NULL,NULL),(100,'p','staff','/order_manage','view',NULL,NULL,NULL),(101,'p','staff','goods:add_btn','use',NULL,NULL,NULL),(102,'p','staff','goods:edit_btn','use',NULL,NULL,NULL),(103,'p','staff','goods:delete_btn','use',NULL,NULL,NULL),(104,'p','staff','/goods/','GET',NULL,NULL,NULL),(105,'p','staff','/goods/','POST',NULL,NULL,NULL),(106,'p','staff','/goods/:id','PUT',NULL,NULL,NULL),(107,'p','staff','/goods/off','POST',NULL,NULL,NULL),(108,'p','staff','/goods/on','POST',NULL,NULL,NULL),(109,'p','staff','/goods/removal','POST',NULL,NULL,NULL),(110,'p','staff','/order','POST',NULL,NULL,NULL),(111,'p','staff','/order/:id','DELETE',NULL,NULL,NULL),(112,'p','staff','/order/:id','PATCH',NULL,NULL,NULL),(113,'p','staff','/tj/summary','GET',NULL,NULL,NULL),(114,'p','staff','/tj/user-count','POST',NULL,NULL,NULL),(115,'p','staff','/tj/goods-count','POST',NULL,NULL,NULL),(116,'p','staff','/tj/order-count','POST',NULL,NULL,NULL),(117,'g','1','admin',NULL,NULL,NULL,NULL),(118,'g','4','manager',NULL,NULL,NULL,NULL),(119,'g','5','manager',NULL,NULL,NULL,NULL),(120,'g','6','manager',NULL,NULL,NULL,NULL),(121,'g','3','staff',NULL,NULL,NULL,NULL),(122,'g','7','staff',NULL,NULL,NULL,NULL),(123,'g','8','staff',NULL,NULL,NULL,NULL),(124,'g','9','staff',NULL,NULL,NULL,NULL),(125,'g','10','staff',NULL,NULL,NULL,NULL),(126,'g','11','staff',NULL,NULL,NULL,NULL),(127,'g','12','staff',NULL,NULL,NULL,NULL),(128,'g','13','staff',NULL,NULL,NULL,NULL),(129,'g','14','staff',NULL,NULL,NULL,NULL),(130,'g','15','staff',NULL,NULL,NULL,NULL),(131,'g','16','staff',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `casbin_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `order_num` int(11) NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'热销推荐',NULL,'店内主打，必点系列',1,'2026-05-29 16:13:10','2026-06-02 15:02:42',NULL),(2,'精品奶茶',NULL,'经典醇香，回味无穷',2,'2026-05-29 16:13:10','2026-06-02 15:02:42',NULL),(3,'鲜果茶',NULL,'新鲜水果，现泡好茶',5,'2026-05-29 16:13:10','2026-06-01 06:56:22',NULL),(4,'咖啡系列',NULL,'提神醒脑，醇厚口感',3,'2026-05-29 16:13:10','2026-06-01 06:56:26',NULL),(5,'精选小吃',NULL,'茶点搭配，美味加倍',6,'2026-05-29 16:13:10','2026-06-01 06:49:49',NULL),(6,'饮品',NULL,'各种好喝的饮品',4,'2026-05-31 00:35:38','2026-06-01 06:56:26',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkin_records`
--

DROP TABLE IF EXISTS `checkin_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checkin_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '签到用户 id',
  `checkin_date` date NOT NULL COMMENT '签到日期',
  `day_number` tinyint(4) NOT NULL COMMENT '签到周期中的天数 (1-7)',
  `streak` int(11) NOT NULL DEFAULT '1' COMMENT '连续签到天数',
  `coupon_id` int(11) DEFAULT NULL COMMENT '奖励的用户优惠券 id（null = 无奖励）',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`,`checkin_date`),
  KEY `coupon_id` (`coupon_id`),
  KEY `idx_user_streak` (`user_id`,`streak`),
  CONSTRAINT `checkin_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `checkin_records_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `user_coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='用户签到记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkin_records`
--

LOCK TABLES `checkin_records` WRITE;
/*!40000 ALTER TABLE `checkin_records` DISABLE KEYS */;
INSERT INTO `checkin_records` VALUES (1,17,'2026-06-04',1,1,1,'2026-06-04 06:26:48','2026-06-04 06:26:48');
/*!40000 ALTER TABLE `checkin_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkin_rewards`
--

DROP TABLE IF EXISTS `checkin_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checkin_rewards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day_number` tinyint(4) NOT NULL COMMENT '签到周期天数 (1-7)',
  `template_id` int(11) NOT NULL COMMENT '关联优惠券模板 id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `day_number` (`day_number`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `checkin_rewards_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `coupon_templates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='签到奖励配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkin_rewards`
--

LOCK TABLES `checkin_rewards` WRITE;
/*!40000 ALTER TABLE `checkin_rewards` DISABLE KEYS */;
INSERT INTO `checkin_rewards` VALUES (1,1,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(2,2,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(3,3,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(4,4,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(5,5,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(6,6,2,'2026-06-04 06:20:20','2026-06-04 06:20:20'),(7,7,2,'2026-06-04 06:20:20','2026-06-04 06:20:20');
/*!40000 ALTER TABLE `checkin_rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_templates`
--

DROP TABLE IF EXISTS `coupon_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '优惠券名称，如''满50减10''',
  `type` tinyint(4) NOT NULL COMMENT '优惠券类型 (1: 满减券, 2: 折扣券, 3: 固定金额券)',
  `value` decimal(10,2) NOT NULL COMMENT '面值：满减金额 / 折扣比例(如0.85) / 固定减免金额',
  `min_spend` decimal(10,2) DEFAULT '0.00' COMMENT '最低消费门槛',
  `max_discount` decimal(10,2) DEFAULT NULL COMMENT '折扣券最大优惠金额（封顶），null 表示不限',
  `store_id` int(11) DEFAULT NULL COMMENT '关联门店，null = 平台通用券',
  `total_count` int(11) NOT NULL COMMENT '总发放数量，-1 表示不限量',
  `claimed_count` int(11) DEFAULT '0' COMMENT '已领取数量',
  `per_user_limit` int(11) DEFAULT '1' COMMENT '每人限领数量',
  `start_time` datetime NOT NULL COMMENT '有效期开始',
  `end_time` datetime NOT NULL COMMENT '有效期结束',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 (1: 启用, 0: 停用)',
  `created_by` int(11) DEFAULT NULL COMMENT '创建者 user_id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='优惠券模板表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_templates`
--

LOCK TABLES `coupon_templates` WRITE;
/*!40000 ALTER TABLE `coupon_templates` DISABLE KEYS */;
INSERT INTO `coupon_templates` VALUES (1,'满15减10',1,10.00,15.00,NULL,NULL,100,0,1,'2026-06-03 16:00:00','2026-07-30 16:00:00',0,1,'2026-06-04 04:56:33','2026-06-04 06:01:24'),(2,'满15减10',1,10.00,15.00,NULL,NULL,100,1,1,'2026-06-03 16:00:00','2026-07-30 16:00:00',1,1,'2026-06-04 06:20:07','2026-06-04 06:26:48');
/*!40000 ALTER TABLE `coupon_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_name` varchar(255) NOT NULL,
  `goods_price` decimal(10,2) NOT NULL,
  `goods_num` int(11) NOT NULL,
  `store_id` int(11) NOT NULL COMMENT '所属门店ID',
  `goods_img` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `goods_detail` text COMMENT '商品详情介绍',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '商品状态 1-上架中 0-已下架',
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COMMENT='商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'招牌珍珠奶茶',27.28,989,22,'http://127.0.0.1:8800/online/5de4cf61-eec8-4575-a5bb-9740093ade48.png','2026-05-29 16:13:10','2026-06-04 05:49:55','招牌珍珠奶茶',1),(2,'杨枝甘露',12.69,999,22,'http://127.0.0.1:8800/online/d1fe7a0f-0dc4-488a-ae1f-e0f092a4ff7f.png','2026-05-29 16:13:10','2026-06-04 05:54:06','杨枝甘露',1),(3,'多肉葡萄',18.17,987,22,'http://127.0.0.1:8800/online/be838100-99fc-417b-8dfe-b6ce3a0021e6.png','2026-05-29 16:13:10','2026-06-04 05:51:35','多肉葡萄',1),(4,'冰鲜柠檬水',21.41,997,22,'http://127.0.0.1:8800/online/68b39c9c-205a-4dfb-8322-916465059207.jpg','2026-05-29 16:13:10','2026-06-04 05:48:41','冰鲜柠檬水',1),(5,'芝芝莓莓',11.96,999,22,'http://127.0.0.1:8800/online/cbba2f53-273a-408a-8858-903e1709b667.png','2026-05-29 16:13:10','2026-06-04 05:42:19','芝芝莓莓',0),(6,'美式咖啡',21.41,997,22,'http://127.0.0.1:8800/online/1deb0dd6-73cf-4ed0-a959-aa3d475cf356.png','2026-05-29 16:13:10','2026-06-04 05:48:23','美式咖啡',1),(7,'生椰拿铁',19.91,997,20,'http://127.0.0.1:8800/online/3acaadcd-cc6b-4e0e-98e4-64077f136095.png','2026-05-29 16:13:10','2026-06-01 07:57:00',NULL,1),(8,'燕麦拿铁',28.94,999,22,'http://127.0.0.1:8800/online/d73b3822-1084-413b-b569-a300d6b79822.jpg','2026-05-29 16:13:10','2026-06-04 05:53:43','燕麦拿铁',1),(9,'卡布奇诺',27.68,994,22,'http://127.0.0.1:8800/online/dd4146e2-1941-493a-98f9-b5491c1be688.png','2026-05-29 16:13:10','2026-06-04 05:49:30','卡布奇诺',1),(10,'摩卡',15.38,999,22,'http://127.0.0.1:8800/online/9827ac53-f443-4fde-9a7a-076da558d292.png','2026-05-29 16:13:10','2026-06-04 05:56:20','摩卡',1),(11,'黄金脆薯',18.82,998,22,'http://127.0.0.1:8800/online/3aa4440b-61b6-48a2-ace2-ef0f751b7309.jpg','2026-05-29 16:13:10','2026-06-04 05:42:04','黄金脆薯',1),(12,'奥尔良烤翅',16.54,999,22,'http://127.0.0.1:8800/online/4b115da2-95a6-4a7e-be18-40e2206d6c17.jpg','2026-05-29 16:13:10','2026-06-04 05:55:03','奥尔良烤翅',1),(13,'爆米花',24.00,996,22,'http://127.0.0.1:8800/online/d38e21da-9ac0-4146-8e7d-e405b161fe95.jpg','2026-05-29 16:13:10','2026-06-04 05:47:46','爆米花',1),(14,'红豆奶茶',29.47,997,22,'http://127.0.0.1:8800/online/e6117232-43a9-4877-8cc1-5b3895cf376c.png','2026-05-29 16:13:10','2026-06-04 05:50:39','红豆',1),(15,'红茶',13.55,999,22,'http://127.0.0.1:8800/online/bba60ef9-0523-48a0-b8ea-53e4d6b496b2.jpg','2026-05-29 16:13:10','2026-06-04 05:56:01','红茶',1),(16,'抹茶拿铁',12.66,985,20,'http://127.0.0.1:8800/online/8a49d47a-d65d-47f8-81d3-6c8c805ab968.png','2026-05-29 16:13:10','2026-06-04 05:51:17','抹茶拿铁',1),(17,'满杯红柚',21.03,999,22,'http://127.0.0.1:8800/online/64f80942-114b-49ea-9ff5-da5578fcd4c3.jpg','2026-05-29 16:13:10','2026-06-04 05:53:26','满杯红柚',1),(18,'四季春青茶',15.70,999,22,'http://127.0.0.1:8800/online/94deb9d8-2ce6-4196-8b67-17347489a39d.jpg','2026-05-29 16:13:10','2026-06-04 05:47:25','四季春青茶',1),(19,'茉莉毛峰',23.00,997,22,'http://127.0.0.1:8800/online/e1394bf6-4c16-4606-985c-295a2cbb976a.jpg','2026-05-29 16:13:10','2026-06-04 05:50:09','茉莉毛峰',1),(20,'炭焙乌龙',19.84,995,1,'http://127.0.0.1:8800/online/0a19c7d2-944e-4572-8121-4f2c5b14f52b.jpg','2026-05-29 16:13:10','2026-06-04 06:43:35','炭焙乌龙',1),(21,'饮品01',23.28,100,1,'/online/0a19c7d2-944e-4572-8121-4f2c5b14f52b.jpg','2026-05-31 00:35:38','2026-06-01 07:57:00','这是第1款美味的饮品。',1),(22,'饮品02',27.09,97,1,'/online/0ad4804b-8c96-4dce-80db-208621da954c.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第2款美味的饮品。',1),(23,'饮品03',20.99,100,1,'/online/3aa4440b-61b6-48a2-ace2-ef0f751b7309.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第3款美味的饮品。',1),(24,'饮品04',12.63,100,1,'/online/3acaadcd-cc6b-4e0e-98e4-64077f136095.png','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第4款美味的饮品。',1),(25,'饮品05',15.67,100,1,'/online/4a6305e8-0720-4ce7-9361-f32a688d974b.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第5款美味的饮品。',1),(26,'饮品06',26.29,100,1,'/online/62a3d786-b630-4c17-b6e8-761a3dbab499.png','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第6款美味的饮品。',1),(27,'饮品07',26.66,100,1,'/online/68b39c9c-205a-4dfb-8322-916465059207.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第7款美味的饮品。',1),(28,'饮品08',23.35,98,1,'/online/954a3cfb-b47b-45d9-96b2-d05ebb601633.jpg','2026-05-31 00:35:38','2026-06-01 10:13:00','这是第8款美味的饮品。',1),(29,'饮品09',25.46,100,1,'/online/9618a3fa-2350-4a6d-ba76-91ab14f851f4.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第9款美味的饮品。',1),(30,'饮品10',20.55,100,1,'/online/99d2666a-2695-4c28-bf04-de1497fe8cbf.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第10款美味的饮品。',1),(31,'饮品11',15.84,100,1,'/online/a2922c52-f44a-46c2-89bf-a5e2e75afa75.jpg','2026-05-31 00:35:38','2026-06-01 07:57:19','这是第11款美味的饮品。',1),(32,'饮品12',25.62,100,1,'/online/a83cca4b-bb58-453b-84c5-4c2cf6104c32.jpg','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第12款美味的饮品。',1),(33,'饮品13',17.70,100,1,'/online/e1394bf6-4c16-4606-985c-295a2cbb976a.jpg','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第13款美味的饮品。',1),(34,'饮品14',16.56,100,1,'/online/e398d308-03e3-4b1c-ab00-587c595efa54.png','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第14款美味的饮品。',1),(35,'饮品15',22.18,100,1,'/online/0a19c7d2-944e-4572-8121-4f2c5b14f52b.jpg','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第15款美味的饮品。',1),(36,'饮品16',22.55,100,1,'/online/0ad4804b-8c96-4dce-80db-208621da954c.jpg','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第16款美味的饮品。',1),(37,'饮品17',24.64,100,1,'/online/3aa4440b-61b6-48a2-ace2-ef0f751b7309.jpg','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第17款美味的饮品。',1),(38,'饮品18',26.69,100,1,'/online/3acaadcd-cc6b-4e0e-98e4-64077f136095.png','2026-05-31 00:35:38','2026-06-01 07:56:49','这是第18款美味的饮品。',1),(39,'饮品19',11.61,100,1,'http://127.0.0.1:8800/online/fa6698b5-b492-4d60-bd24-4b196a31f2e7.jpg','2026-05-31 00:35:38','2026-06-04 05:52:33','这是第19款美味的饮品。',1),(40,'椰汁',16.09,100,1,'http://127.0.0.1:8800/online/dde3e87a-7f8b-4561-90d0-069e6089b96f.png','2026-05-31 00:35:38','2026-06-04 05:43:43','椰子汁',1),(41,'生椰拿铁',11.00,0,1,'http://127.0.0.1:8800/online/0466eeff-65da-4df6-9f3a-363a53bdf308.png','2026-05-31 01:20:14','2026-06-03 05:35:51',NULL,1),(42,'奶茶',11.00,23,22,'http://127.0.0.1:8800/online/0466eeff-65da-4df6-9f3a-363a53bdf308.png','2026-05-31 01:20:14','2026-06-04 05:55:33','奶茶',1),(43,'测试1',11.00,18,1,'http://127.0.0.1:8800/online/0466eeff-65da-4df6-9f3a-363a53bdf308.png','2026-05-31 01:20:14','2026-06-03 06:30:14',NULL,1),(44,'测试1',11.00,19,1,'http://127.0.0.1:8800/online/0466eeff-65da-4df6-9f3a-363a53bdf308.png','2026-05-31 01:20:14','2026-06-04 06:43:35',NULL,1),(45,'椰汁',6.00,28,1,'http://127.0.0.1:8800/online/6ad909aa-8b44-4c84-8f7d-299238eef82b.png','2026-06-01 06:11:16','2026-06-03 13:56:05',NULL,1),(46,'烤奶',6.00,0,1,'http://127.0.0.1:8800/online/1a68c0ba-0e5e-4f88-bbca-57926dc6fe6f.png','2026-06-02 08:17:22','2026-06-03 05:37:27','烤奶',1);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_category`
--

DROP TABLE IF EXISTS `goods_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goods_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `goods_category_category_id_goods_id_unique` (`goods_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `goods_category_ibfk_1` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `goods_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_category`
--

LOCK TABLES `goods_category` WRITE;
/*!40000 ALTER TABLE `goods_category` DISABLE KEYS */;
INSERT INTO `goods_category` VALUES (1,1,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(2,1,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(3,2,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(4,2,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(5,3,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(6,3,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(7,4,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(8,4,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(9,5,4,'2026-05-29 16:13:10','2026-05-29 16:13:10','2026-06-02 16:54:57'),(10,6,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(11,6,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(12,7,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(13,8,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(14,9,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(15,10,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(16,11,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(17,12,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(18,12,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(19,13,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(20,13,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(21,14,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(22,15,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(23,16,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(24,16,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(25,17,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(26,17,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(27,18,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(28,18,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(29,19,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(30,20,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(31,21,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(32,22,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(33,23,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(34,24,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(35,25,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(36,26,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(37,27,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(38,28,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(39,29,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(40,30,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(41,31,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(42,32,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(43,33,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(44,34,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(45,35,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(46,36,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(47,37,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(48,38,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(49,39,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(50,40,6,'2026-05-31 00:35:38','2026-05-31 00:35:38',NULL),(51,44,6,'2026-05-31 01:20:34','2026-05-31 01:20:34',NULL),(52,44,1,'2026-05-31 01:20:34','2026-05-31 01:20:34',NULL),(53,44,2,'2026-05-31 01:20:34','2026-05-31 01:20:34',NULL),(54,43,1,'2026-05-31 01:20:53','2026-05-31 01:20:53',NULL),(55,43,2,'2026-05-31 01:20:53','2026-05-31 01:20:53',NULL),(56,43,4,'2026-05-31 01:20:53','2026-05-31 01:20:53',NULL),(57,43,5,'2026-05-31 01:20:53','2026-05-31 01:20:53',NULL),(58,45,6,'2026-06-01 06:11:30','2026-06-01 06:11:30',NULL),(59,45,1,'2026-06-01 06:34:44','2026-06-01 06:34:44',NULL),(60,45,2,'2026-06-01 06:34:44','2026-06-01 06:34:44',NULL),(61,41,1,'2026-06-01 07:47:08','2026-06-01 07:47:08',NULL),(62,41,4,'2026-06-01 07:47:08','2026-06-01 07:47:08',NULL),(63,41,2,'2026-06-01 07:47:08','2026-06-01 07:47:08',NULL),(64,42,1,'2026-06-01 10:20:51','2026-06-01 10:20:51',NULL),(65,42,2,'2026-06-01 10:20:51','2026-06-01 10:20:51',NULL),(66,42,4,'2026-06-01 10:20:51','2026-06-01 10:20:51',NULL),(67,46,1,'2026-06-02 08:17:22','2026-06-02 08:17:22',NULL),(68,5,2,'2026-06-02 16:54:57','2026-06-02 16:54:57',NULL);
/*!40000 ALTER TABLE `goods_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '公告类型 (1: 通知, 2: 公告, 3: 活动)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 (true: 发布, false: 隐藏)',
  `author` varchar(255) DEFAULT NULL COMMENT '发布者',
  `icon` varchar(255) DEFAULT NULL COMMENT '公告图标',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `store_id` int(11) DEFAULT NULL COMMENT '所属门店ID (NULL 表示全店公告)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='系统公告表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'测试1','测试',1,0,'admin','Notification','2026-05-31 01:09:26','2026-06-01 07:24:20',1),(2,'测试','模型上下文協定是Anthropic所推動的一項開放標準，目的是為大型語言模型應用提供一個標準化介面，使其能夠連接外部資料來源和工具，並與其互動。 MCP的目標在克服大型語言模型應用僅依賴其訓練資料的局限性，使其能夠取得所需的上下文資訊，以執行更廣泛的任務。',1,1,'admin','Bell','2026-06-01 07:27:21','2026-06-01 07:27:21',0),(3,'测试','1111',1,1,'admin','ep:first-aid-kit','2026-06-02 19:59:46','2026-06-02 19:59:46',0);
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL COMMENT '订单id',
  `goods_id` int(11) NOT NULL COMMENT '商品id',
  `quantity` int(11) NOT NULL COMMENT '商品数量',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `specs` varchar(255) DEFAULT NULL COMMENT '规格快照 (JSON 或字符串)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `spec_ids` varchar(255) DEFAULT NULL COMMENT '规格ID列表 (逗号分隔)',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `goods_id` (`goods_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:28:42','2026-05-30 05:28:42',NULL),(2,2,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:28:58','2026-05-30 05:28:58',NULL),(3,3,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:29:13','2026-05-30 05:29:13',NULL),(4,4,6,1,21.41,NULL,'2026-05-30 05:33:51','2026-05-30 05:33:51',NULL),(5,4,19,1,23.00,'中型/不另外加糖/常规冰','2026-05-30 05:33:51','2026-05-30 05:33:51',NULL),(6,5,1,1,27.28,NULL,'2026-05-30 07:30:10','2026-05-30 07:30:10',NULL),(7,6,6,1,21.41,NULL,'2026-05-30 07:30:29','2026-05-30 07:30:29',NULL),(8,6,19,1,23.00,'中型/不另外加糖/常规冰','2026-05-30 07:30:29','2026-05-30 07:30:29',NULL),(9,7,1,1,27.28,NULL,'2026-05-30 08:06:36','2026-05-30 08:06:36',NULL),(11,9,1,1,27.28,NULL,'2026-05-30 08:46:15','2026-05-30 08:46:15',NULL),(12,10,1,1,27.28,NULL,'2026-05-30 08:58:38','2026-05-30 08:58:38',NULL),(13,11,1,1,27.28,NULL,'2026-05-30 08:58:45','2026-05-30 08:58:45',NULL),(14,12,1,1,27.28,NULL,'2026-05-30 09:06:08','2026-05-30 09:06:08',NULL),(15,13,7,1,19.91,'不另外加糖/标准牛奶','2026-05-30 09:22:17','2026-05-30 09:22:17',NULL),(16,14,4,1,21.41,'中型/不另外加糖/常规冰','2026-05-30 09:59:48','2026-05-30 09:59:48',NULL),(17,15,1,1,27.28,NULL,'2026-05-30 10:05:06','2026-05-30 10:05:06',NULL),(18,16,1,1,27.28,NULL,'2026-05-30 10:06:43','2026-05-30 10:06:43',NULL),(19,17,7,1,19.91,'不另外加糖/标准牛奶','2026-05-30 10:07:48','2026-05-30 10:07:48',NULL),(20,18,1,1,27.28,'中型/不另外加糖/常规冰/无/标准牛奶','2026-05-30 10:08:04','2026-05-30 10:08:04',NULL),(21,19,4,1,21.41,'中型/不另外加糖/少冰','2026-05-30 10:18:02','2026-05-30 10:18:02',NULL),(22,20,11,1,18.82,NULL,'2026-05-30 10:36:03','2026-05-30 10:36:03',NULL),(23,21,14,1,29.47,NULL,'2026-05-30 10:48:05','2026-05-30 10:48:05',NULL),(24,22,9,1,27.68,NULL,'2026-05-30 17:02:58','2026-05-30 17:02:58',NULL),(25,23,9,1,27.68,NULL,'2026-05-30 17:13:40','2026-05-30 17:13:40',NULL),(26,24,9,1,27.68,NULL,'2026-05-30 17:26:19','2026-05-30 17:26:19',NULL),(27,25,14,1,29.47,NULL,'2026-05-30 17:38:53','2026-05-30 17:38:53',NULL),(28,26,9,1,27.68,NULL,'2026-05-30 17:48:30','2026-05-30 17:48:30',NULL),(29,27,3,1,18.17,NULL,'2026-05-30 17:57:47','2026-05-30 17:57:47',NULL),(30,28,3,1,18.17,NULL,'2026-05-30 17:57:53','2026-05-30 17:57:53',NULL),(31,29,3,1,18.17,NULL,'2026-05-30 17:58:09','2026-05-30 17:58:09',NULL),(32,30,3,1,18.17,NULL,'2026-05-30 18:06:19','2026-05-30 18:06:19',NULL),(33,31,3,1,18.17,NULL,'2026-05-30 18:11:24','2026-05-30 18:11:24',NULL),(34,32,3,1,18.17,NULL,'2026-05-30 18:11:48','2026-05-30 18:11:48',NULL),(35,33,3,1,18.17,NULL,'2026-05-30 18:13:25','2026-05-30 18:13:25',NULL),(36,34,3,1,18.17,NULL,'2026-05-30 18:18:55','2026-05-30 18:18:55',NULL),(37,35,3,1,18.17,NULL,'2026-05-30 18:18:59','2026-05-30 18:18:59',NULL),(38,36,3,1,18.17,NULL,'2026-05-30 18:22:06','2026-05-30 18:22:06',NULL),(39,37,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:22:27','2026-05-30 18:22:27',NULL),(40,38,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:23:48','2026-05-30 18:23:48',NULL),(41,39,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:24:53','2026-05-30 18:24:53',NULL),(42,40,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:25:33','2026-05-30 18:25:33',NULL),(43,41,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:28:28','2026-05-30 18:28:28',NULL),(44,42,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:28:46','2026-05-30 18:28:46',NULL),(45,43,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:30:22','2026-05-30 18:30:22',NULL),(46,44,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:30:29','2026-05-30 18:30:29',NULL),(47,45,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:31:16','2026-05-30 18:31:16',NULL),(48,46,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:31:20','2026-05-30 18:31:20',NULL),(49,47,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:31:26','2026-05-30 18:31:26',NULL),(50,48,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:58:15','2026-05-30 18:58:15',NULL),(51,49,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:58:28','2026-05-30 18:58:28',NULL),(52,50,16,1,12.66,'中型/不另外加糖/常规冰','2026-05-30 18:59:29','2026-05-30 18:59:29',NULL),(53,51,3,1,18.17,NULL,'2026-05-30 23:50:30','2026-05-30 23:50:30',NULL),(54,52,3,1,18.17,NULL,'2026-05-30 23:50:32','2026-05-30 23:50:32',NULL),(55,53,22,1,27.09,NULL,'2026-05-31 08:25:46','2026-05-31 08:25:46',NULL),(56,54,22,1,27.09,NULL,'2026-05-31 08:26:04','2026-05-31 08:26:04',NULL),(57,55,22,1,27.09,NULL,'2026-05-31 08:31:13','2026-05-31 08:31:13',NULL),(58,56,45,1,6.00,'中型/常规冰','2026-06-01 08:51:40','2026-06-01 08:51:40',NULL),(59,57,45,1,6.00,'中型/常规冰','2026-06-01 08:51:44','2026-06-01 08:51:44',NULL),(60,58,45,1,6.00,'中型/常规冰','2026-06-01 08:51:51','2026-06-01 08:51:51',NULL),(61,59,41,1,11.00,'中型/不另外加糖/常规冰','2026-06-01 08:53:59','2026-06-01 08:53:59',NULL),(62,60,41,1,11.00,'中型/不另外加糖/常规冰','2026-06-01 08:54:21','2026-06-01 08:54:21',NULL),(63,60,45,1,6.00,'中型/常规冰','2026-06-01 08:54:21','2026-06-01 08:54:21',NULL),(64,61,45,1,6.00,'中型/常规冰','2026-06-01 08:56:43','2026-06-01 08:56:43',NULL),(65,62,45,1,6.00,'中型/常规冰','2026-06-01 09:48:26','2026-06-01 09:48:26',NULL),(66,63,45,1,6.00,'中型/常规冰','2026-06-01 09:49:39','2026-06-01 09:49:39',NULL),(72,67,41,2,11.00,NULL,'2026-06-02 08:42:31','2026-06-02 08:42:31',NULL),(73,68,41,1,11.00,NULL,'2026-06-02 08:58:17','2026-06-02 08:58:17',NULL),(74,68,41,1,11.00,NULL,'2026-06-02 08:58:17','2026-06-02 08:58:17',NULL),(75,69,41,1,11.00,NULL,'2026-06-02 09:01:05','2026-06-02 09:01:05',NULL),(76,69,46,1,12.00,'霸王桶','2026-06-02 09:01:05','2026-06-02 09:01:05',NULL),(77,70,46,1,13.00,'全糖/椰果/布丁/红豆','2026-06-02 09:07:12','2026-06-02 09:07:12',NULL),(78,70,41,1,29.00,'全糖/去冰/燕麦奶/霸王桶/椰果/布丁/红豆','2026-06-02 09:07:12','2026-06-02 09:07:12',NULL),(79,71,46,1,6.00,NULL,'2026-06-02 09:07:30','2026-06-02 09:07:30',NULL),(80,71,41,1,11.00,NULL,'2026-06-02 09:07:30','2026-06-02 09:07:30',NULL),(81,72,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:12:10','2026-06-02 09:12:10','35,37,47,54'),(82,72,41,1,21.00,'全糖/常规冰/厚椰乳/霸王桶','2026-06-02 09:12:10','2026-06-02 09:12:10','36,37,50,56'),(83,73,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:12:22','2026-06-02 09:12:22','35,37,47,54'),(84,73,41,1,21.00,'全糖/常规冰/厚椰乳/霸王桶','2026-06-02 09:12:22','2026-06-02 09:12:22','36,37,50,56'),(85,74,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:12:34','2026-06-02 09:12:34','35,37,47,54'),(86,74,41,1,21.00,'全糖/常规冰/厚椰乳/霸王桶','2026-06-02 09:12:34','2026-06-02 09:12:34','36,37,50,56'),(87,75,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:25:00','2026-06-02 09:25:00','35,37,47,54'),(88,75,41,1,21.00,'全糖/常规冰/厚椰乳/霸王桶','2026-06-02 09:25:00','2026-06-02 09:25:00','36,37,50,56'),(89,76,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:27:17','2026-06-02 09:27:17','35,37,47,54'),(90,76,41,1,21.00,'全糖/常规冰/厚椰乳/霸王桶','2026-06-02 09:27:17','2026-06-02 09:27:17','36,37,50,56'),(91,77,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:46:35','2026-06-02 09:46:35','35,37,47,54'),(92,77,45,1,9.00,'少冰/大杯','2026-06-02 09:46:35','2026-06-02 09:46:35','52,55'),(93,77,41,1,16.00,'七分糖/常规冰/脱脂奶/大杯','2026-06-02 09:46:35','2026-06-02 09:46:35','35,37,49,55'),(94,78,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:46:54','2026-06-02 09:46:54','35,37,47,54'),(95,78,45,1,9.00,'少冰/大杯','2026-06-02 09:46:54','2026-06-02 09:46:54','52,55'),(96,78,41,1,16.00,'七分糖/常规冰/脱脂奶/大杯','2026-06-02 09:46:54','2026-06-02 09:46:54','35,37,49,55'),(97,79,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:47:01','2026-06-02 09:47:01','35,37,47,54'),(98,79,45,1,9.00,'少冰/大杯','2026-06-02 09:47:01','2026-06-02 09:47:01','52,55'),(99,79,41,1,16.00,'七分糖/常规冰/脱脂奶/大杯','2026-06-02 09:47:01','2026-06-02 09:47:01','35,37,49,55'),(100,80,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:47:43','2026-06-02 09:47:43','35,37,47,54'),(101,81,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:49:09','2026-06-02 09:49:09','35,37,47,54'),(102,81,41,1,11.00,'七分糖/常规冰/标准牛奶/中杯','2026-06-02 09:49:09','2026-06-02 09:49:09','35,37,47,54'),(103,82,41,1,16.00,'七分糖/常规冰/燕麦奶/中杯','2026-06-02 09:49:31','2026-06-02 09:49:31','35,37,48,54'),(104,83,41,1,16.00,'七分糖/常规冰/燕麦奶/中杯','2026-06-02 09:50:51','2026-06-02 09:50:51','35,37,48,54'),(105,84,20,1,19.84,'七分糖/常规冰/中杯','2026-06-03 05:35:51','2026-06-03 05:35:51','35,37,54'),(106,84,41,1,16.00,'七分糖/常规冰/燕麦奶/中杯','2026-06-03 05:35:51','2026-06-03 05:35:51','35,37,48,54'),(107,85,46,1,8.00,'七分糖/中杯/无/珍珠','2026-06-03 05:37:27','2026-06-03 05:37:27','35,54,57,58'),(108,86,44,1,11.00,'七分糖/少冰/中杯','2026-06-03 06:28:04','2026-06-03 06:28:04','35,38,54'),(109,87,44,1,11.00,'七分糖/少冰/中杯','2026-06-03 06:28:09','2026-06-03 06:28:09','35,38,54'),(110,88,20,1,19.84,'七分糖/常规冰/中杯','2026-06-03 06:28:54','2026-06-03 06:28:54','35,37,54'),(111,89,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:29:50','2026-06-03 06:29:50','35,37,54'),(112,90,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:10','2026-06-03 06:30:10','35,37,54'),(113,90,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:10','2026-06-03 06:30:10','35,37,54'),(114,91,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:11','2026-06-03 06:30:11','35,37,54'),(115,91,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:11','2026-06-03 06:30:11','35,37,54'),(116,92,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:13','2026-06-03 06:30:13','35,37,54'),(117,92,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:13','2026-06-03 06:30:13','35,37,54'),(118,93,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:14','2026-06-03 06:30:14','35,37,54'),(119,93,43,1,11.00,'七分糖/常规冰/中杯','2026-06-03 06:30:14','2026-06-03 06:30:14','35,37,54'),(120,94,9,1,27.68,NULL,'2026-06-03 06:31:04','2026-06-03 06:31:04',NULL),(121,95,45,2,6.00,'常规冰/中杯','2026-06-03 13:56:05','2026-06-03 13:56:05','51,54'),(122,96,44,1,11.00,'七分糖/常规冰/中杯','2026-06-04 06:32:05','2026-06-04 06:32:05','35,37,54'),(123,96,20,1,19.84,'七分糖/常规冰/中杯','2026-06-04 06:32:05','2026-06-04 06:32:05','35,37,54'),(124,97,44,1,11.00,'七分糖/常规冰/中杯','2026-06-04 06:43:35','2026-06-04 06:43:35','35,37,54'),(125,97,20,1,19.84,'七分糖/常规冰/中杯','2026-06-04 06:43:35','2026-06-04 06:43:35','35,37,54');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `address_id` int(11) DEFAULT NULL COMMENT '地址id',
  `total_price` decimal(10,2) NOT NULL COMMENT '订单总价',
  `order_number` varchar(32) NOT NULL COMMENT '订单编号',
  `state` tinyint(4) NOT NULL COMMENT '订单状态',
  `order_type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '订单类型 (1: 自提, 2: 外卖)',
  `pickup_code` varchar(20) DEFAULT NULL COMMENT '取餐码',
  `coupon_id` int(11) DEFAULT NULL COMMENT '使用的优惠券id',
  `discount_amount` decimal(10,2) DEFAULT '0.00' COMMENT '优惠金额',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '优惠前原价',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,17,NULL,26.00,'YH828547575246917',1,1,'A001',NULL,0.00,NULL,'2026-05-30 05:28:42','2026-05-30 05:28:45'),(2,17,NULL,26.00,'YH828547639193669',1,1,'A002',NULL,0.00,NULL,'2026-05-30 05:28:58','2026-05-30 08:58:30'),(3,17,NULL,26.00,'YH828547701055557',1,1,'A003',NULL,0.00,NULL,'2026-05-30 05:29:13','2026-05-30 05:29:14'),(4,17,NULL,44.41,'YH828548837634117',2,1,'A004',NULL,0.00,NULL,'2026-05-30 05:33:51','2026-05-30 07:01:18'),(5,17,NULL,27.28,'YH828577425301573',4,1,NULL,NULL,0.00,NULL,'2026-05-30 07:30:10','2026-05-30 08:52:43'),(6,17,NULL,44.41,'YH828577503297605',1,1,'A005',NULL,0.00,NULL,'2026-05-30 07:30:29','2026-05-30 07:30:30'),(7,17,3,27.28,'YH828586379206725',1,2,NULL,NULL,0.00,NULL,'2026-05-30 08:06:36','2026-05-30 08:06:37'),(9,17,3,27.28,'YH828596124176453',1,2,NULL,NULL,0.00,NULL,'2026-05-30 08:46:15','2026-05-30 08:46:16'),(10,17,NULL,27.28,'YH828599167381573',4,1,NULL,NULL,0.00,NULL,'2026-05-30 08:58:38','2026-05-30 10:02:12'),(11,17,NULL,27.28,'YH828599195783237',4,1,NULL,NULL,0.00,NULL,'2026-05-30 08:58:45','2026-05-30 10:02:16'),(12,17,NULL,27.28,'YH828601009995845',4,1,NULL,NULL,0.00,NULL,'2026-05-30 09:06:08','2026-05-30 09:53:10'),(13,17,NULL,19.91,'YH828604977414213',4,1,NULL,NULL,0.00,NULL,'2026-05-30 09:22:17','2026-05-30 10:02:05'),(14,17,3,21.41,'YH828614199472197',4,2,NULL,NULL,0.00,NULL,'2026-05-30 09:59:48','2026-05-30 10:00:48'),(15,17,3,27.28,'YH828615501369413',4,2,NULL,NULL,0.00,NULL,'2026-05-30 10:05:06','2026-05-30 10:06:06'),(16,17,3,27.28,'YH828615898251333',1,2,NULL,NULL,0.00,NULL,'2026-05-30 10:06:43','2026-05-30 10:07:39'),(17,17,3,19.91,'YH828616165724229',1,2,NULL,NULL,0.00,NULL,'2026-05-30 10:07:48','2026-05-30 10:07:49'),(18,17,NULL,27.28,'YH828616231747653',1,1,'A001',NULL,0.00,NULL,'2026-05-30 10:08:04','2026-05-30 10:08:05'),(19,17,NULL,21.41,'YH828618678726725',4,1,NULL,NULL,0.00,NULL,'2026-05-30 10:18:02','2026-05-30 10:19:02'),(20,17,NULL,18.82,'YH828623109402693',1,1,'A002',NULL,0.00,NULL,'2026-05-30 10:36:03','2026-05-30 10:36:05'),(21,17,NULL,29.47,'YH828626066210885',1,1,'A003',NULL,0.00,NULL,'2026-05-30 10:48:05','2026-05-30 10:48:33'),(22,17,NULL,27.68,'YH828718198599749',1,1,'A001',NULL,0.00,NULL,'2026-05-30 17:02:58','2026-05-30 17:03:03'),(23,17,NULL,27.68,'YH828720827277381',1,1,'A002',NULL,0.00,NULL,'2026-05-30 17:13:40','2026-05-30 17:13:41'),(24,17,NULL,27.68,'YH828723936182341',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:26:19','2026-05-30 17:27:19'),(25,17,NULL,29.47,'YH828727023546437',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:38:53','2026-05-30 17:39:53'),(26,17,NULL,27.68,'YH828729384992837',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:48:30','2026-05-30 17:49:30'),(27,17,NULL,18.17,'YH828731667460165',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:57:47','2026-05-30 17:58:47'),(28,17,NULL,18.17,'YH828731693514821',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:57:53','2026-05-30 17:58:53'),(29,17,NULL,18.17,'YH828731759865925',4,1,NULL,NULL,0.00,NULL,'2026-05-30 17:58:09','2026-05-30 17:59:09'),(30,17,NULL,18.17,'YH828733766410309',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:06:19','2026-05-30 18:07:19'),(31,17,NULL,18.17,'YH828735013359685',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:11:24','2026-05-30 18:12:24'),(32,17,NULL,18.17,'YH828735113261125',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:11:48','2026-05-30 18:12:48'),(33,17,NULL,18.17,'YH828735511859269',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:13:25','2026-05-30 18:14:25'),(34,17,NULL,18.17,'YH828736863531077',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:18:55','2026-05-30 18:19:55'),(35,17,NULL,18.17,'YH828736880242757',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:18:59','2026-05-30 18:19:59'),(36,17,NULL,18.17,'YH828737643069509',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:22:06','2026-05-30 18:23:06'),(37,17,NULL,12.66,'YH828737732489285',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:22:27','2026-05-30 18:23:28'),(38,17,NULL,12.66,'YH828738063573061',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:23:48','2026-05-30 18:24:48'),(39,17,NULL,12.66,'YH828738329223237',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:24:53','2026-05-30 18:25:53'),(40,17,NULL,12.66,'YH828738491560005',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:25:33','2026-05-30 18:26:33'),(41,17,NULL,12.66,'YH828739210399813',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:28:28','2026-05-30 18:29:29'),(42,17,NULL,12.66,'YH828739281727557',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:28:46','2026-05-30 18:29:46'),(43,17,NULL,12.66,'YH828739676708933',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:30:22','2026-05-30 18:31:22'),(44,17,NULL,12.66,'YH828739703164997',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:30:29','2026-05-30 18:31:29'),(45,17,NULL,12.66,'YH828739896590405',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:31:16','2026-05-30 18:32:16'),(46,17,NULL,12.66,'YH828739915149381',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:31:20','2026-05-30 18:32:21'),(47,17,NULL,12.66,'YH828739939291205',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:31:26','2026-05-30 18:32:27'),(48,17,NULL,12.66,'YH828746529398853',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:58:15','2026-05-30 18:59:15'),(49,17,NULL,12.66,'YH828746582126661',4,1,NULL,NULL,0.00,NULL,'2026-05-30 18:58:28','2026-05-30 18:59:28'),(50,17,NULL,12.66,'YH828746833580101',0,1,NULL,NULL,0.00,NULL,'2026-05-30 18:59:29','2026-05-30 18:59:29'),(51,17,NULL,18.17,'YH828818351751237',4,1,NULL,NULL,0.00,NULL,'2026-05-30 23:50:30','2026-05-30 23:51:30'),(52,17,NULL,18.17,'YH828818361286725',4,1,NULL,NULL,0.00,NULL,'2026-05-30 23:50:32','2026-05-30 23:51:32'),(53,17,NULL,27.09,'YH828944982179909',4,1,NULL,NULL,0.00,NULL,'2026-05-31 08:25:46','2026-05-31 08:26:46'),(54,17,NULL,27.09,'YH828945056972869',4,1,NULL,NULL,0.00,NULL,'2026-05-31 08:26:04','2026-05-31 08:27:04'),(55,17,NULL,27.09,'YH828946322972741',4,1,NULL,NULL,0.00,NULL,'2026-05-31 08:31:13','2026-05-31 08:32:13'),(56,17,NULL,6.00,'YH829305244622917',4,1,NULL,NULL,0.00,NULL,'2026-06-01 08:51:40','2026-06-01 08:52:40'),(57,17,NULL,6.00,'YH829305259819077',4,1,NULL,NULL,0.00,NULL,'2026-06-01 08:51:44','2026-06-01 08:52:44'),(58,17,NULL,6.00,'YH829305288863813',4,1,NULL,NULL,0.00,NULL,'2026-06-01 08:51:51','2026-06-01 08:52:51'),(59,17,NULL,11.00,'YH829305814147141',2,1,'A001',NULL,0.00,NULL,'2026-06-01 08:53:59','2026-06-02 18:36:49'),(60,17,NULL,17.00,'YH829305901346885',2,1,'A002',NULL,0.00,NULL,'2026-06-01 08:54:21','2026-06-02 18:36:46'),(61,17,3,6.00,'YH829306482974789',1,2,NULL,NULL,0.00,NULL,'2026-06-01 08:56:43','2026-06-01 08:57:11'),(62,17,NULL,6.00,'YH829319193190469',4,1,NULL,NULL,0.00,NULL,'2026-06-01 09:48:26','2026-06-01 09:49:26'),(63,17,NULL,6.00,'YH829319491960901',1,1,'A003',NULL,0.00,NULL,'2026-06-01 09:49:39','2026-06-01 09:49:49'),(67,17,NULL,22.00,'YH829656889364549',4,1,NULL,NULL,0.00,NULL,'2026-06-02 08:42:31','2026-06-02 08:43:31'),(68,17,NULL,22.00,'YH829660764123205',2,1,'A002',NULL,0.00,NULL,'2026-06-02 08:58:17','2026-06-02 09:17:46'),(69,17,NULL,23.00,'YH829661453172805',2,1,'A003',NULL,0.00,NULL,'2026-06-02 09:01:05','2026-06-02 09:17:41'),(70,17,NULL,42.00,'YH829662954885189',2,1,'A004',NULL,0.00,NULL,'2026-06-02 09:07:12','2026-06-02 09:17:39'),(71,17,NULL,17.00,'YH829663029289029',2,1,'A005',NULL,0.00,NULL,'2026-06-02 09:07:30','2026-06-02 09:17:38'),(72,17,NULL,32.00,'YH829664175870021',2,1,'A006',NULL,0.00,NULL,'2026-06-02 09:12:10','2026-06-02 09:17:31'),(73,17,NULL,32.00,'YH829664225783877',2,1,'A007',NULL,0.00,NULL,'2026-06-02 09:12:22','2026-06-02 09:17:30'),(74,17,NULL,32.00,'YH829664274538565',2,1,'A008',NULL,0.00,NULL,'2026-06-02 09:12:34','2026-06-02 09:17:28'),(75,17,NULL,32.00,'YH829667328221253',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:25:00','2026-06-02 09:26:00'),(76,17,NULL,32.00,'YH829667892617285',2,1,'A009',NULL,0.00,NULL,'2026-06-02 09:27:17','2026-06-02 16:55:41'),(77,17,NULL,36.00,'YH829672634527813',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:46:35','2026-06-02 09:47:35'),(78,17,NULL,36.00,'YH829672713949253',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:46:54','2026-06-02 09:47:55'),(79,17,NULL,36.00,'YH829672740470853',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:47:01','2026-06-02 09:48:01'),(80,17,NULL,11.00,'YH829672911073349',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:47:43','2026-06-02 09:48:43'),(81,17,NULL,22.00,'YH829673263874117',2,1,'A010',NULL,0.00,NULL,'2026-06-02 09:49:09','2026-06-02 16:55:33'),(82,17,NULL,16.00,'YH829673356832837',4,1,NULL,NULL,0.00,NULL,'2026-06-02 09:49:31','2026-06-02 09:50:31'),(83,17,NULL,16.00,'YH829673683505221',2,1,'A011',NULL,0.00,NULL,'2026-06-02 09:50:51','2026-06-02 16:55:35'),(84,17,NULL,35.84,'YH829964909142085',1,1,'A001',NULL,0.00,NULL,'2026-06-03 05:35:51','2026-06-03 05:35:56'),(85,17,NULL,8.00,'YH829965302136901',1,1,'A002',NULL,0.00,NULL,'2026-06-03 05:37:27','2026-06-03 05:37:32'),(86,17,NULL,11.00,'YH829977739403333',1,1,'A003',NULL,0.00,NULL,'2026-06-03 06:28:04','2026-06-03 06:28:21'),(87,17,NULL,11.00,'YH829977760804933',1,1,'A004',NULL,0.00,NULL,'2026-06-03 06:28:09','2026-06-03 06:28:23'),(88,17,3,19.84,'YH829977946947653',1,2,NULL,NULL,0.00,NULL,'2026-06-03 06:28:54','2026-06-03 06:28:59'),(89,17,NULL,11.00,'YH829978177110085',1,1,'A005',NULL,0.00,NULL,'2026-06-03 06:29:50','2026-06-03 06:29:57'),(90,17,NULL,22.00,'YH829978255564869',1,1,'A009',NULL,0.00,NULL,'2026-06-03 06:30:10','2026-06-03 06:30:20'),(91,17,NULL,22.00,'YH829978263162949',1,1,'A008',NULL,0.00,NULL,'2026-06-03 06:30:11','2026-06-03 06:30:19'),(92,17,NULL,22.00,'YH829978270478405',1,1,'A007',NULL,0.00,NULL,'2026-06-03 06:30:13','2026-06-03 06:30:19'),(93,17,NULL,22.00,'YH829978272931909',1,1,'A006',NULL,0.00,NULL,'2026-06-03 06:30:14','2026-06-03 06:30:18'),(94,17,NULL,27.68,'YH829978480504901',4,1,NULL,NULL,0.00,NULL,'2026-06-03 06:31:04','2026-06-03 06:32:05'),(95,17,NULL,12.00,'YH830087846518853',1,1,'A010',NULL,0.00,NULL,'2026-06-03 13:56:05','2026-06-03 13:56:17'),(96,17,NULL,30.84,'YH830332622438469',2,1,'A001',NULL,0.00,30.84,'2026-06-04 06:32:05','2026-06-04 06:58:24'),(97,17,NULL,20.84,'YH830335448805445',2,1,'A002',1,10.00,30.84,'2026-06-04 06:43:35','2026-06-04 06:58:18');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_spec_rel`
--

DROP TABLE IF EXISTS `product_spec_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_spec_rel` (
  `product_id` int(11) NOT NULL COMMENT '商品ID',
  `group_id` int(11) NOT NULL COMMENT '规格组ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`product_id`,`group_id`),
  UNIQUE KEY `product_spec_rel_group_id_product_id_unique` (`product_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `product_spec_rel_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_spec_rel_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `spec_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品-规格关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_spec_rel`
--

LOCK TABLES `product_spec_rel` WRITE;
/*!40000 ALTER TABLE `product_spec_rel` DISABLE KEYS */;
INSERT INTO `product_spec_rel` VALUES (1,1,'2026-06-04 05:49:55','2026-06-04 05:49:55'),(1,2,'2026-06-04 05:49:55','2026-06-04 05:49:55'),(1,3,'2026-06-04 05:49:55','2026-06-04 05:49:55'),(1,4,'2026-06-04 05:49:55','2026-06-04 05:49:55'),(1,5,'2026-06-04 05:49:55','2026-06-04 05:49:55'),(2,1,'2026-06-04 05:54:06','2026-06-04 05:54:06'),(2,2,'2026-06-04 05:54:06','2026-06-04 05:54:06'),(2,3,'2026-06-04 05:54:06','2026-06-04 05:54:06'),(3,1,'2026-06-04 05:51:35','2026-06-04 05:51:35'),(3,2,'2026-06-04 05:51:35','2026-06-04 05:51:35'),(3,3,'2026-06-04 05:51:35','2026-06-04 05:51:35'),(4,1,'2026-06-04 05:48:41','2026-06-04 05:48:41'),(4,2,'2026-06-04 05:48:41','2026-06-04 05:48:41'),(4,3,'2026-06-04 05:48:41','2026-06-04 05:48:41'),(5,1,'2026-06-04 05:42:19','2026-06-04 05:42:19'),(5,2,'2026-06-04 05:42:19','2026-06-04 05:42:19'),(6,1,'2026-06-04 05:48:23','2026-06-04 05:48:23'),(6,3,'2026-06-04 05:48:23','2026-06-04 05:48:23'),(7,2,'2026-05-30 09:21:51','2026-05-30 09:21:51'),(7,5,'2026-05-30 09:21:51','2026-05-30 09:21:51'),(8,1,'2026-06-04 05:53:43','2026-06-04 05:53:43'),(8,2,'2026-06-04 05:53:43','2026-06-04 05:53:43'),(8,3,'2026-06-04 05:53:43','2026-06-04 05:53:43'),(9,2,'2026-06-04 05:49:30','2026-06-04 05:49:30'),(9,3,'2026-06-04 05:49:30','2026-06-04 05:49:30'),(10,2,'2026-06-04 05:56:20','2026-06-04 05:56:20'),(10,3,'2026-06-04 05:56:20','2026-06-04 05:56:20'),(13,2,'2026-06-04 05:47:46','2026-06-04 05:47:46'),(13,4,'2026-06-04 05:47:46','2026-06-04 05:47:46'),(14,1,'2026-06-04 05:50:39','2026-06-04 05:50:39'),(14,2,'2026-06-04 05:50:39','2026-06-04 05:50:39'),(14,3,'2026-06-04 05:50:39','2026-06-04 05:50:39'),(14,4,'2026-06-04 05:50:39','2026-06-04 05:50:39'),(15,1,'2026-06-04 05:56:01','2026-06-04 05:56:01'),(15,2,'2026-06-04 05:56:01','2026-06-04 05:56:01'),(15,3,'2026-06-04 05:56:01','2026-06-04 05:56:01'),(16,1,'2026-06-04 05:51:17','2026-06-04 05:51:17'),(16,2,'2026-06-04 05:51:17','2026-06-04 05:51:17'),(16,3,'2026-06-04 05:51:17','2026-06-04 05:51:17'),(17,1,'2026-06-04 05:53:26','2026-06-04 05:53:26'),(17,2,'2026-06-04 05:53:26','2026-06-04 05:53:26'),(17,3,'2026-06-04 05:53:26','2026-06-04 05:53:26'),(17,4,'2026-06-04 05:53:26','2026-06-04 05:53:26'),(18,1,'2026-06-04 05:47:25','2026-06-04 05:47:25'),(18,2,'2026-06-04 05:47:25','2026-06-04 05:47:25'),(18,3,'2026-06-04 05:47:25','2026-06-04 05:47:25'),(19,1,'2026-06-04 05:50:09','2026-06-04 05:50:09'),(19,2,'2026-06-04 05:50:09','2026-06-04 05:50:09'),(19,3,'2026-06-04 05:50:09','2026-06-04 05:50:09'),(20,1,'2026-06-02 16:54:23','2026-06-02 16:54:23'),(20,2,'2026-06-02 16:54:23','2026-06-02 16:54:23'),(20,3,'2026-06-02 16:54:23','2026-06-02 16:54:23'),(39,1,'2026-06-04 05:52:33','2026-06-04 05:52:33'),(39,2,'2026-06-04 05:52:33','2026-06-04 05:52:33'),(39,3,'2026-06-04 05:52:33','2026-06-04 05:52:33'),(40,1,'2026-06-04 05:43:43','2026-06-04 05:43:43'),(41,1,'2026-06-01 10:20:37','2026-06-01 10:20:37'),(41,2,'2026-06-01 10:20:37','2026-06-01 10:20:37'),(41,3,'2026-06-01 10:20:37','2026-06-01 10:20:37'),(41,5,'2026-06-01 10:20:37','2026-06-01 10:20:37'),(42,1,'2026-06-04 05:55:33','2026-06-04 05:55:33'),(42,2,'2026-06-04 05:55:33','2026-06-04 05:55:33'),(42,3,'2026-06-04 05:55:33','2026-06-04 05:55:33'),(43,1,'2026-06-02 16:40:28','2026-06-02 16:40:28'),(43,2,'2026-06-02 16:40:28','2026-06-02 16:40:28'),(43,3,'2026-06-02 16:40:28','2026-06-02 16:40:28'),(44,1,'2026-06-02 16:40:44','2026-06-02 16:40:44'),(44,2,'2026-06-02 16:40:44','2026-06-02 16:40:44'),(44,3,'2026-06-02 16:40:44','2026-06-02 16:40:44'),(45,1,'2026-06-02 08:03:23','2026-06-02 08:03:23'),(45,6,'2026-06-02 08:03:23','2026-06-02 08:03:23'),(46,1,'2026-06-03 04:51:01','2026-06-03 04:51:01'),(46,2,'2026-06-03 04:51:01','2026-06-03 04:51:01'),(46,4,'2026-06-03 04:51:01','2026-06-03 04:51:01');
/*!40000 ALTER TABLE `product_spec_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rbac_permissions`
--

DROP TABLE IF EXISTS `rbac_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rbac_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '权限名称',
  `code` varchar(255) NOT NULL COMMENT '权限编码（如 user:add）',
  `type` tinyint(4) NOT NULL COMMENT '权限类型（1: 菜单, 2: 按钮, 3: 接口）',
  `path` varchar(255) DEFAULT NULL COMMENT '路由路径或接口路径',
  `method` varchar(255) DEFAULT NULL COMMENT '请求方法（GET/POST等，仅接口类型有效）',
  `parent_id` int(11) DEFAULT '0' COMMENT '父权限ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_permissions`
--

LOCK TABLES `rbac_permissions` WRITE;
/*!40000 ALTER TABLE `rbac_permissions` DISABLE KEYS */;
INSERT INTO `rbac_permissions` VALUES (1,'控制台','/dashboard',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(2,'用户管理','/user_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(3,'分类管理','/category_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(4,'商品管理','/goods_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(5,'订单管理','/order_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(6,'地址管理','/address_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(7,'门店管理','/store_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(8,'系统管理','/system',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(9,'角色管理','/system/role',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(10,'菜单管理','/system/menu',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(11,'公告管理','/system/notice',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(12,'添加商品按钮','goods:add_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(13,'编辑商品按钮','goods:edit_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(14,'下架商品按钮','goods:delete_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(15,'权限分配按钮','user:assign_role_btn',2,NULL,NULL,2,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(16,'分配权限按钮','role:assign_perm_btn',2,NULL,NULL,9,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(17,'查询商品接口','api:goods:all',3,'/goods/','GET',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(18,'创建商品接口','api:goods:create',3,'/goods/','POST',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(19,'编辑商品接口','api:goods:update',3,'/goods/:id','PUT',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(20,'下架商品接口','api:goods:off',3,'/goods/off','POST',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(21,'上架商品接口','api:goods:on',3,'/goods/on','POST',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(22,'查询下架商品接口','api:goods:removal',3,'/goods/removal','POST',4,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(23,'查询分类接口','api:category:all',3,'/category/','GET',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(24,'创建分类接口','api:category:create',3,'/category/','POST',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(25,'更新分类接口','api:category:update',3,'/category/:id','PUT',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(26,'删除分类接口','api:category:delete',3,'/category/:id','DELETE',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(27,'分类添加商品接口','api:category:add_goods',3,'/category/:id/goods','POST',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(28,'分类移除商品接口','api:category:remove_goods',3,'/category/:id/goods','DELETE',3,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(29,'查询订单接口','api:order:all',3,'/order','POST',5,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(30,'删除订单接口','api:order:delete',3,'/order/:id','DELETE',5,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(31,'修改订单状态接口','api:order:update',3,'/order/:id','PATCH',5,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(32,'查询地址接口','api:address:all',3,'/address/findAll','POST',6,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(33,'查询门店接口','api:store:all',3,'/store/list','GET',7,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(34,'创建门店接口','api:store:create',3,'/store','POST',7,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(35,'更新门店接口','api:store:update',3,'/store/:id','PUT',7,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(36,'删除门店接口','api:store:delete',3,'/store/:id','DELETE',7,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(37,'首页概览统计接口','api:tj:summary',3,'/tj/summary','GET',1,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(38,'用户统计接口','api:tj:user_count',3,'/tj/user-count','POST',1,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(39,'商品统计接口','api:tj:goods_count',3,'/tj/goods-count','POST',1,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(40,'订单统计接口','api:tj:order_count',3,'/tj/order-count','POST',1,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(41,'查询所有用户接口','api:user:all',3,'/user/all','POST',2,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(42,'管理员添加用户接口','api:user:add',3,'/user/add','POST',2,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(43,'删除用户接口','api:user:delete',3,'/user/:id','DELETE',2,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(44,'查询公告接口','api:notice:list',3,'/notice/list','POST',11,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(45,'发布公告接口','api:notice:create',3,'/notice','POST',11,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(46,'更新公告接口','api:notice:update',3,'/notice/:id','PUT',11,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(47,'删除公告接口','api:notice:delete',3,'/notice/:id','DELETE',11,'2026-05-29 16:13:10','2026-06-04 06:14:40'),(48,'所有接口权限','api:all',3,'*','*',0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(49,'编辑门店按钮','goods:edit_store',2,'','',4,'2026-06-02 16:31:55','2026-06-04 06:14:40'),(50,'优惠券管理','/coupon_manage',1,NULL,NULL,0,'2026-06-04 04:06:32','2026-06-04 04:06:32'),(51,'添加优惠券按钮','coupon:add_btn',2,NULL,NULL,50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(52,'编辑优惠券按钮','coupon:edit_btn',2,NULL,NULL,50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(53,'销售趋势接口','api:tj:sales_trend',3,'/tj/sales-trend','GET',1,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(54,'分类分布接口','api:tj:category_distribution',3,'/tj/category-distribution','GET',1,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(55,'最近订单接口','api:tj:recent_orders',3,'/tj/recent-orders','GET',1,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(56,'查询优惠券模板接口','api:coupon:list',3,'/coupon/template','GET',50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(57,'创建优惠券模板接口','api:coupon:create',3,'/coupon/template','POST',50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(58,'更新优惠券模板接口','api:coupon:update',3,'/coupon/template/:id','PUT',50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(59,'停用优惠券模板接口','api:coupon:delete',3,'/coupon/template/:id','DELETE',50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(60,'查看领取记录接口','api:coupon:records',3,'/coupon/template/:id/records','GET',50,'2026-06-04 04:06:32','2026-06-04 06:14:40'),(61,'活动管理','/checkin_manage',1,NULL,NULL,0,'2026-06-04 06:14:40','2026-06-04 06:14:40'),(62,'查询签到奖励配置接口','api:checkin:rewards_get',3,'/checkin/rewards','GET',61,'2026-06-04 06:14:40','2026-06-04 06:14:40'),(63,'更新签到奖励配置接口','api:checkin:rewards_put',3,'/checkin/rewards','PUT',61,'2026-06-04 06:14:40','2026-06-04 06:14:40'),(64,'查询签到记录接口','api:checkin:records',3,'/checkin/records','GET',61,'2026-06-04 06:14:40','2026-06-04 06:14:40');
/*!40000 ALTER TABLE `rbac_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rbac_role_permissions`
--

DROP TABLE IF EXISTS `rbac_role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rbac_role_permissions` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`),
  UNIQUE KEY `rbac_role_permissions_permissionId_roleId_unique` (`roleId`,`permissionId`),
  KEY `permissionId` (`permissionId`),
  CONSTRAINT `rbac_role_permissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `rbac_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rbac_role_permissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `rbac_permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_role_permissions`
--

LOCK TABLES `rbac_role_permissions` WRITE;
/*!40000 ALTER TABLE `rbac_role_permissions` DISABLE KEYS */;
INSERT INTO `rbac_role_permissions` VALUES (1,1),(3,1),(1,2),(2,2),(1,3),(2,3),(1,4),(2,4),(3,4),(1,5),(2,5),(3,5),(1,6),(1,7),(1,8),(2,8),(1,9),(1,10),(1,11),(2,11),(1,12),(2,12),(3,12),(1,13),(2,13),(3,13),(1,14),(2,14),(3,14),(1,15),(2,15),(1,16),(1,17),(2,17),(3,17),(1,18),(2,18),(3,18),(1,19),(2,19),(3,19),(1,20),(2,20),(3,20),(1,21),(2,21),(3,21),(1,22),(2,22),(3,22),(1,23),(2,23),(1,24),(2,24),(1,25),(2,25),(1,26),(2,26),(1,27),(2,27),(1,28),(2,28),(1,29),(2,29),(3,29),(1,30),(2,30),(3,30),(1,31),(2,31),(3,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(3,37),(1,38),(3,38),(1,39),(3,39),(1,40),(3,40),(1,41),(2,41),(1,42),(2,42),(1,43),(2,43),(1,44),(2,44),(1,45),(2,45),(1,46),(2,46),(1,47),(2,47),(1,48),(1,49),(2,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64);
/*!40000 ALTER TABLE `rbac_role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rbac_roles`
--

DROP TABLE IF EXISTS `rbac_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rbac_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL COMMENT '角色名称',
  `role_key` varchar(255) NOT NULL COMMENT '角色权限字符串',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '角色状态（true正常 false停用）',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_key` (`role_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_roles`
--

LOCK TABLES `rbac_roles` WRITE;
/*!40000 ALTER TABLE `rbac_roles` DISABLE KEYS */;
INSERT INTO `rbac_roles` VALUES (1,'超级管理员','admin',1,'系统最高权限，拥有所有操作权限','2026-05-29 16:13:09','2026-05-29 16:13:09'),(2,'店长','manager',1,'门店负责人，负责管理门店商品和订单','2026-05-29 16:19:37','2026-05-29 16:19:37'),(3,'店员','staff',1,'普通店员，负责核销和日常操作','2026-05-29 16:19:37','2026-05-29 16:19:37');
/*!40000 ALTER TABLE `rbac_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rbac_user_roles`
--

DROP TABLE IF EXISTS `rbac_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rbac_user_roles` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  UNIQUE KEY `rbac_user_roles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `rbac_user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rbac_user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `rbac_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_user_roles`
--

LOCK TABLES `rbac_user_roles` WRITE;
/*!40000 ALTER TABLE `rbac_user_roles` DISABLE KEYS */;
INSERT INTO `rbac_user_roles` VALUES (1,1),(4,2),(5,2),(6,2),(3,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3);
/*!40000 ALTER TABLE `rbac_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spec_group`
--

DROP TABLE IF EXISTS `spec_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spec_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '规格名（如：杯型、温度、甜度）',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `select_type` enum('single','multiple') DEFAULT 'single' COMMENT '选择模式: single-单选, multiple-多选',
  `is_required` tinyint(1) DEFAULT '1' COMMENT '是否必选: 0-否, 1-是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='规格组表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_group`
--

LOCK TABLES `spec_group` WRITE;
/*!40000 ALTER TABLE `spec_group` DISABLE KEYS */;
INSERT INTO `spec_group` VALUES (1,'杯型','2026-05-29 16:15:53','2026-06-02 08:33:37',NULL,'single',1),(2,'甜度','2026-05-29 16:15:53','2026-06-02 08:24:12',NULL,'single',1),(3,'温度','2026-05-29 16:15:53','2026-06-02 08:24:18',NULL,'single',1),(4,'加料','2026-05-29 16:15:53','2026-06-02 08:33:50',NULL,'multiple',1),(5,'奶底','2026-05-29 16:15:53','2026-06-02 08:24:29',NULL,'single',1),(6,'温度','2026-06-01 06:11:16','2026-06-02 08:24:34',NULL,'single',1);
/*!40000 ALTER TABLE `spec_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spec_option`
--

DROP TABLE IF EXISTS `spec_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spec_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `group_id` int(11) NOT NULL COMMENT '所属规格组ID',
  `name` varchar(255) NOT NULL COMMENT '选项名（如：大杯、去冰、七分甜）',
  `price_delta` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格增量（如大杯 +3元，去冰 +0元）',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0' COMMENT '是否默认选中: 0-否, 1-是',
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `spec_option_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `spec_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COMMENT='规格选项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_option`
--

LOCK TABLES `spec_option` WRITE;
/*!40000 ALTER TABLE `spec_option` DISABLE KEYS */;
INSERT INTO `spec_option` VALUES (32,2,'不另外加糖',0.00,'2026-06-02 08:24:12','2026-06-02 08:24:12',NULL,0),(33,2,'三分糖',0.00,'2026-06-02 08:24:12','2026-06-02 08:24:12',NULL,0),(34,2,'五分糖',0.00,'2026-06-02 08:24:12','2026-06-02 08:24:12',NULL,0),(35,2,'七分糖',0.00,'2026-06-02 08:24:12','2026-06-02 08:24:12',NULL,1),(36,2,'全糖',0.00,'2026-06-02 08:24:12','2026-06-02 08:24:12',NULL,0),(37,3,'常规冰',0.00,'2026-06-02 08:24:18','2026-06-02 08:24:18',NULL,1),(38,3,'少冰',0.00,'2026-06-02 08:24:18','2026-06-02 08:24:18',NULL,0),(39,3,'去冰',0.00,'2026-06-02 08:24:18','2026-06-02 08:24:18',NULL,0),(40,3,'热',0.00,'2026-06-02 08:24:18','2026-06-02 08:24:18',NULL,0),(41,3,'温',0.00,'2026-06-02 08:24:18','2026-06-02 08:24:18',NULL,0),(47,5,'标准牛奶',0.00,'2026-06-02 08:24:29','2026-06-02 08:24:29',NULL,1),(48,5,'燕麦奶',5.00,'2026-06-02 08:24:29','2026-06-02 08:24:29',NULL,0),(49,5,'脱脂奶',2.00,'2026-06-02 08:24:29','2026-06-02 08:24:29',NULL,0),(50,5,'厚椰乳',4.00,'2026-06-02 08:24:29','2026-06-02 08:24:29',NULL,0),(51,6,'常规冰',0.00,'2026-06-02 08:24:34','2026-06-02 08:24:34',NULL,1),(52,6,'少冰',0.00,'2026-06-02 08:24:34','2026-06-02 08:24:34',NULL,0),(53,6,'去冰',0.00,'2026-06-02 08:24:34','2026-06-02 08:24:34',NULL,0),(54,1,'中杯',0.00,'2026-06-02 08:33:37','2026-06-02 08:33:37',NULL,1),(55,1,'大杯',3.00,'2026-06-02 08:33:37','2026-06-02 08:33:37',NULL,0),(56,1,'霸王桶',6.00,'2026-06-02 08:33:37','2026-06-02 08:33:37',NULL,0),(57,4,'无',0.00,'2026-06-02 08:33:50','2026-06-02 08:33:50',NULL,1),(58,4,'珍珠',2.00,'2026-06-02 08:33:50','2026-06-02 08:33:50',NULL,0),(59,4,'椰果',2.00,'2026-06-02 08:33:50','2026-06-02 08:33:50',NULL,0),(60,4,'布丁',3.00,'2026-06-02 08:33:50','2026-06-02 08:33:50',NULL,0),(61,4,'红豆',2.00,'2026-06-02 08:33:50','2026-06-02 08:33:50',NULL,0);
/*!40000 ALTER TABLE `spec_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_photos`
--

DROP TABLE IF EXISTS `store_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `store_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL COMMENT '所属门店ID',
  `url` varchar(500) NOT NULL COMMENT '图片URL',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `store_photos_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='门店照片表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_photos`
--

LOCK TABLES `store_photos` WRITE;
/*!40000 ALTER TABLE `store_photos` DISABLE KEYS */;
INSERT INTO `store_photos` VALUES (2,21,'http://127.0.0.1:8800/online/2cd99d67-12c0-4b8b-a090-f880dda9f0b0.jpg',0,'2026-06-02 16:11:28','2026-06-02 16:11:28'),(4,22,'http://127.0.0.1:8800/online/c0de36ba-d661-4c75-ae0f-af4ce630d233.png',0,'2026-06-02 16:16:22','2026-06-02 16:16:22'),(5,20,'http://127.0.0.1:8800/online/f305769e-d6a5-4678-a3c1-ad8b4bc64715.jpg',0,'2026-06-02 16:20:00','2026-06-02 16:20:00'),(6,1,'http://127.0.0.1:8800/online/1de28263-4769-457a-8d4d-351eef613b55.jpg',0,'2026-06-02 17:44:36','2026-06-02 17:44:36');
/*!40000 ALTER TABLE `store_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '所属商家(用户)ID',
  `name` varchar(255) NOT NULL COMMENT '门店名称',
  `description` text COMMENT '门店描述',
  `address` varchar(255) DEFAULT NULL COMMENT '门店地址',
  `business_hours` varchar(255) DEFAULT NULL COMMENT '营业时间(例如: 08:00-22:00)',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `phone` varchar(255) DEFAULT NULL COMMENT '联系电话',
  `logo` varchar(255) DEFAULT NULL COMMENT '门店Logo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '门店状态(1=营业中, 0=已关闭)',
  `province` varchar(100) DEFAULT NULL COMMENT '省',
  `city` varchar(100) DEFAULT NULL COMMENT '市',
  `district` varchar(100) DEFAULT NULL COMMENT '区/县',
  `cover` varchar(500) DEFAULT NULL COMMENT '门店封面图',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='门店表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,1,'勇哥茶饮海师店','这是第 1 个自动化生成的测试门店，主要用于展示门店管理功能。','海南省海口市琼山区府城街道紫荆路','[\"08:00-23:59\",\"00:00-05:00\"]',110.3501913,20.0016204,'1666666666',NULL,'2026-05-29 16:13:10','2026-06-02 17:44:36',1,'海南省','海口市','琼山区','http://127.0.0.1:8800/online/f8a28fc1-b7c6-4e53-9a21-a8e90f38b6fb.jpg'),(20,1,'勇哥茶饮五东路店','这是第 20 个自动化生成的测试门店，主要用于展示门店管理功能。','海南省海口市美兰区新埠街道海甸五东路','[\"08:00-12:00\",\"14:00-22:00\"]',110.3671113,20.0716566,'188888888',NULL,'2026-05-29 16:13:10','2026-06-02 16:20:00',1,'海南省','海口市','美兰区','http://127.0.0.1:8800/online/c2773c42-6d1f-4447-a272-b750be597cd1.jpg'),(21,1,'勇哥茶饮国兴店','','海南省海口市琼山区国兴街道','[\"08:00-22:00\"]',110.3508742,20.0187459,'17777777777',NULL,'2026-06-02 16:11:28','2026-06-02 16:11:28',1,'海南省','海口市','琼山区','http://127.0.0.1:8800/online/be0c12a0-e160-426e-a538-9fdcd88668c5.jpg'),(22,1,'勇哥茶饮海大店','','海南省海口市美兰区人民街道致远路','[\"08:00-22:00\"]',110.3321669,20.0609381,'15555555555',NULL,'2026-06-02 16:16:22','2026-06-02 16:16:22',1,'海南省','海口市','美兰区','http://127.0.0.1:8800/online/c3b7de5c-2bc8-4353-9d38-7892f4960c1e.png');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topping`
--

DROP TABLE IF EXISTS `topping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topping` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '加料名称（如：珍珠、椰果、布丁）',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='加料表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topping`
--

LOCK TABLES `topping` WRITE;
/*!40000 ALTER TABLE `topping` DISABLE KEYS */;
/*!40000 ALTER TABLE `topping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_coupons`
--

DROP TABLE IF EXISTS `user_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '领取用户 id',
  `template_id` int(11) NOT NULL COMMENT '关联优惠券模板 id',
  `order_id` int(11) DEFAULT NULL COMMENT '使用的订单 id（null = 未使用）',
  `status` tinyint(4) DEFAULT '0' COMMENT '状态 (0: 未使用, 1: 已使用, 2: 已过期)',
  `claimed_at` datetime DEFAULT NULL COMMENT '领取时间',
  `used_at` datetime DEFAULT NULL COMMENT '使用时间',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_coupons`
--

LOCK TABLES `user_coupons` WRITE;
/*!40000 ALTER TABLE `user_coupons` DISABLE KEYS */;
INSERT INTO `user_coupons` VALUES (1,17,2,97,1,'2026-06-04 06:26:48','2026-06-04 06:43:35','2026-06-04 06:26:48','2026-06-04 06:43:35');
/*!40000 ALTER TABLE `user_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_stores`
--

DROP TABLE IF EXISTS `user_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_stores` (
  `userId` int(11) NOT NULL COMMENT '用户ID',
  `storeId` int(11) NOT NULL COMMENT '门店ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`,`storeId`),
  UNIQUE KEY `user_stores_storeId_userId_unique` (`userId`,`storeId`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `user_stores_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_stores_ibfk_2` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_stores`
--

LOCK TABLES `user_stores` WRITE;
/*!40000 ALTER TABLE `user_stores` DISABLE KEYS */;
INSERT INTO `user_stores` VALUES (1,1,'2026-06-04 05:58:46','2026-06-04 05:58:46'),(1,20,'2026-06-04 05:58:46','2026-06-04 05:58:46'),(1,21,'2026-06-04 05:58:46','2026-06-04 05:58:46'),(1,22,'2026-06-04 05:57:39','2026-06-04 05:57:39'),(10,20,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(16,20,'2026-05-29 16:19:37','2026-05-29 16:19:37');
/*!40000 ALTER TABLE `user_stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nick_name` varchar(255) NOT NULL COMMENT '昵称',
  `avatar` varchar(255) NOT NULL COMMENT '头像',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `user_name` varchar(255) NOT NULL COMMENT '用户名,唯一',
  `password` char(64) NOT NULL COMMENT '密码',
  `openid` varchar(255) DEFAULT NULL COMMENT '微信小程序openid',
  `unionid` varchar(255) DEFAULT NULL COMMENT '微信unionid',
  `store_id` int(11) DEFAULT NULL COMMENT '所属门店(部门)ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `openid` (`openid`),
  UNIQUE KEY `unionid` (`unionid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'超级管理员','http://127.0.0.1:8800/online/d824bc53-87b2-47fe-9eb0-ba4ff51b1cdd.png','manager1@example.com','admin','$2b$10$YYo437J2yXRi6ILmChXauOgZzkEthc2M6IfjzLncp9EjcEDSXqy0m',NULL,NULL,NULL,'2026-05-29 16:13:09','2026-06-04 05:59:05'),(2,'店长1号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager1','manager1@example.com','manager1','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(3,'店长2号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager2','manager2@example.com','manager2','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(4,'店长3号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager3','manager3@example.com','manager3','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(5,'店长4号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager4','manager4@example.com','manager4','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(6,'店长5号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager5','manager5@example.com','manager5','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(7,'店员1号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff1','staff1@example.com','staff1','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(8,'店员2号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff2','staff2@example.com','staff2','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(9,'店员3号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff3','staff3@example.com','staff3','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(10,'店员4号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff4','staff4@example.com','staff4','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(11,'店员5号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff5','staff5@example.com','staff5','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(12,'店员6号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff6','staff6@example.com','staff6','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(13,'店员7号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff7','staff7@example.com','staff7','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(14,'店员8号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff8','staff8@example.com','staff8','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(15,'店员9号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff9','staff9@example.com','staff9','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(16,'店员10号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff10','staff10@example.com','staff10','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(17,'测试用户','http://tmp/C6H899Lophco170d280d61fab2923bec8d411a9d4358.png','','wx_1GbMbT2EnQ','','obUti5cbxUMb1fI5JU1GbMbT2EnQ',NULL,NULL,'2026-05-30 05:28:39','2026-06-03 14:27:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 15:05:23
