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
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `goods_id` (`goods_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户购物车表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casbin_rule`
--

LOCK TABLES `casbin_rule` WRITE;
/*!40000 ALTER TABLE `casbin_rule` DISABLE KEYS */;
INSERT INTO `casbin_rule` VALUES (1,'p','admin','/dashboard','view',NULL,NULL,NULL),(2,'p','admin','/user_manage','view',NULL,NULL,NULL),(3,'p','admin','/category_manage','view',NULL,NULL,NULL),(4,'p','admin','/goods_manage','view',NULL,NULL,NULL),(5,'p','admin','/order_manage','view',NULL,NULL,NULL),(6,'p','admin','/address_manage','view',NULL,NULL,NULL),(7,'p','admin','/store_manage','view',NULL,NULL,NULL),(8,'p','admin','/system','view',NULL,NULL,NULL),(9,'p','admin','/system/role','view',NULL,NULL,NULL),(10,'p','admin','/system/menu','view',NULL,NULL,NULL),(11,'p','admin','/system/notice','view',NULL,NULL,NULL),(12,'p','admin','goods:add_btn','use',NULL,NULL,NULL),(13,'p','admin','goods:edit_btn','use',NULL,NULL,NULL),(14,'p','admin','goods:delete_btn','use',NULL,NULL,NULL),(15,'p','admin','user:assign_role_btn','use',NULL,NULL,NULL),(16,'p','admin','role:assign_perm_btn','use',NULL,NULL,NULL),(17,'p','admin','/goods/','GET',NULL,NULL,NULL),(18,'p','admin','/goods/','POST',NULL,NULL,NULL),(19,'p','admin','/goods/:id','PUT',NULL,NULL,NULL),(20,'p','admin','/goods/off','POST',NULL,NULL,NULL),(21,'p','admin','/goods/on','POST',NULL,NULL,NULL),(22,'p','admin','/goods/removal','POST',NULL,NULL,NULL),(23,'p','admin','/category/','GET',NULL,NULL,NULL),(24,'p','admin','/category/','POST',NULL,NULL,NULL),(25,'p','admin','/category/:id','PUT',NULL,NULL,NULL),(26,'p','admin','/category/:id','DELETE',NULL,NULL,NULL),(27,'p','admin','/category/:id/goods','POST',NULL,NULL,NULL),(28,'p','admin','/category/:id/goods','DELETE',NULL,NULL,NULL),(29,'p','admin','/order','POST',NULL,NULL,NULL),(30,'p','admin','/order/:id','DELETE',NULL,NULL,NULL),(31,'p','admin','/order/:id','PATCH',NULL,NULL,NULL),(32,'p','admin','/address/findAll','POST',NULL,NULL,NULL),(33,'p','admin','/store/list','GET',NULL,NULL,NULL),(34,'p','admin','/store','POST',NULL,NULL,NULL),(35,'p','admin','/store/:id','PUT',NULL,NULL,NULL),(36,'p','admin','/store/:id','DELETE',NULL,NULL,NULL),(37,'p','admin','/tj/summary','GET',NULL,NULL,NULL),(38,'p','admin','/tj/user-count','POST',NULL,NULL,NULL),(39,'p','admin','/tj/goods-count','POST',NULL,NULL,NULL),(40,'p','admin','/tj/order-count','POST',NULL,NULL,NULL),(41,'p','admin','/user/all','POST',NULL,NULL,NULL),(42,'p','admin','/user/add','POST',NULL,NULL,NULL),(43,'p','admin','/user/:id','DELETE',NULL,NULL,NULL),(44,'p','admin','/notice/list','POST',NULL,NULL,NULL),(45,'p','admin','/notice','POST',NULL,NULL,NULL),(46,'p','admin','/notice/:id','PUT',NULL,NULL,NULL),(47,'p','admin','/notice/:id','DELETE',NULL,NULL,NULL),(48,'p','admin','*','*',NULL,NULL,NULL),(49,'p','manager','/goods_manage','view',NULL,NULL,NULL),(50,'p','manager','/order_manage','view',NULL,NULL,NULL),(51,'p','manager','/system','view',NULL,NULL,NULL),(52,'p','manager','/system/notice','view',NULL,NULL,NULL),(53,'p','manager','goods:add_btn','use',NULL,NULL,NULL),(54,'p','manager','goods:edit_btn','use',NULL,NULL,NULL),(55,'p','manager','goods:delete_btn','use',NULL,NULL,NULL),(56,'p','manager','/goods/','GET',NULL,NULL,NULL),(57,'p','manager','/goods/','POST',NULL,NULL,NULL),(58,'p','manager','/goods/:id','PUT',NULL,NULL,NULL),(59,'p','manager','/goods/off','POST',NULL,NULL,NULL),(60,'p','manager','/goods/on','POST',NULL,NULL,NULL),(61,'p','manager','/goods/removal','POST',NULL,NULL,NULL),(62,'p','manager','/order','POST',NULL,NULL,NULL),(63,'p','manager','/order/:id','PATCH',NULL,NULL,NULL),(64,'p','manager','/notice/list','POST',NULL,NULL,NULL),(65,'p','staff','/goods_manage','view',NULL,NULL,NULL),(66,'p','staff','/order_manage','view',NULL,NULL,NULL),(67,'p','staff','goods:add_btn','use',NULL,NULL,NULL),(68,'p','staff','goods:edit_btn','use',NULL,NULL,NULL),(69,'p','staff','goods:delete_btn','use',NULL,NULL,NULL),(70,'p','staff','/goods/','GET',NULL,NULL,NULL),(71,'p','staff','/goods/','POST',NULL,NULL,NULL),(72,'p','staff','/goods/:id','PUT',NULL,NULL,NULL),(73,'p','staff','/goods/off','POST',NULL,NULL,NULL),(74,'p','staff','/goods/on','POST',NULL,NULL,NULL),(75,'p','staff','/goods/removal','POST',NULL,NULL,NULL),(76,'p','staff','/order','POST',NULL,NULL,NULL),(77,'p','staff','/order/:id','DELETE',NULL,NULL,NULL),(78,'p','staff','/order/:id','PATCH',NULL,NULL,NULL),(79,'g','1','admin',NULL,NULL,NULL,NULL),(80,'g','2','manager',NULL,NULL,NULL,NULL),(81,'g','3','manager',NULL,NULL,NULL,NULL),(82,'g','4','manager',NULL,NULL,NULL,NULL),(83,'g','5','manager',NULL,NULL,NULL,NULL),(84,'g','6','manager',NULL,NULL,NULL,NULL),(85,'g','7','staff',NULL,NULL,NULL,NULL),(86,'g','8','staff',NULL,NULL,NULL,NULL),(87,'g','9','staff',NULL,NULL,NULL,NULL),(88,'g','10','staff',NULL,NULL,NULL,NULL),(89,'g','11','staff',NULL,NULL,NULL,NULL),(90,'g','12','staff',NULL,NULL,NULL,NULL),(91,'g','13','staff',NULL,NULL,NULL,NULL),(92,'g','14','staff',NULL,NULL,NULL,NULL),(93,'g','15','staff',NULL,NULL,NULL,NULL),(94,'g','16','staff',NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'热销推荐',NULL,'店内主打，必点系列',1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(2,'精品奶茶',NULL,'经典醇香，回味无穷',2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(3,'鲜果茶',NULL,'新鲜水果，现泡好茶',3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(4,'咖啡系列',NULL,'提神醒脑，醇厚口感',4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(5,'精选小吃',NULL,'茶点搭配，美味加倍',5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COMMENT='商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'招牌珍珠奶茶',27.28,999,11,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(2,'杨枝甘露',12.69,999,6,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(3,'多肉葡萄',18.17,999,9,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(4,'冰鲜柠檬水',21.41,999,13,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(5,'芝芝莓莓',11.96,999,19,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(6,'美式咖啡',21.41,998,13,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-30 05:33:51'),(7,'生椰拿铁',19.91,999,20,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(8,'燕麦拿铁',28.94,999,5,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(9,'卡布奇诺',27.68,999,12,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(10,'摩卡',15.38,999,3,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(11,'黄金脆薯',18.82,999,2,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(12,'奥尔良烤翅',16.54,999,6,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(13,'爆米花',24.00,996,15,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-30 05:29:13'),(14,'红豆派',29.47,999,10,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(15,'鸡米花',13.55,999,3,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(16,'抹茶拿铁',12.66,999,9,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(17,'满杯红柚',21.03,999,7,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(18,'四季春青茶',15.70,999,16,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:13:10'),(19,'茉莉毛峰',23.00,998,11,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-30 05:33:51'),(20,'炭焙乌龙',19.84,999,19,'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-05-29 16:13:10','2026-05-29 16:16:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_category`
--

LOCK TABLES `goods_category` WRITE;
/*!40000 ALTER TABLE `goods_category` DISABLE KEYS */;
INSERT INTO `goods_category` VALUES (1,1,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(2,1,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(3,2,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(4,2,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(5,3,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(6,3,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(7,4,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(8,4,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(9,5,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(10,6,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(11,6,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(12,7,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(13,8,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(14,9,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(15,10,2,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(16,11,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(17,12,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(18,12,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(19,13,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(20,13,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(21,14,5,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(22,15,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(23,16,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(24,16,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(25,17,4,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(26,17,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(27,18,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(28,18,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(29,19,3,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL),(30,20,1,'2026-05-29 16:13:10','2026-05-29 16:13:10',NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统公告表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `goods_id` (`goods_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:28:42','2026-05-30 05:28:42'),(2,2,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:28:58','2026-05-30 05:28:58'),(3,3,13,1,26.00,'不另外加糖/椰果','2026-05-30 05:29:13','2026-05-30 05:29:13'),(4,4,6,1,21.41,NULL,'2026-05-30 05:33:51','2026-05-30 05:33:51'),(5,4,19,1,23.00,'中型/不另外加糖/常规冰','2026-05-30 05:33:51','2026-05-30 05:33:51');
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,17,NULL,26.00,'YH828547575246917',1,1,'A001','2026-05-30 05:28:42','2026-05-30 05:28:45'),(2,17,NULL,26.00,'YH828547639193669',0,1,'A002','2026-05-30 05:28:58','2026-05-30 05:28:58'),(3,17,NULL,26.00,'YH828547701055557',1,1,'A003','2026-05-30 05:29:13','2026-05-30 05:29:14'),(4,17,NULL,44.41,'YH828548837634117',1,1,'A004','2026-05-30 05:33:51','2026-05-30 05:33:52');
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
INSERT INTO `product_spec_rel` VALUES (13,2,'2026-05-29 16:17:37','2026-05-29 16:17:37'),(13,4,'2026-05-29 16:17:37','2026-05-29 16:17:37'),(19,1,'2026-05-29 16:17:11','2026-05-29 16:17:11'),(19,2,'2026-05-29 16:17:11','2026-05-29 16:17:11'),(19,3,'2026-05-29 16:17:11','2026-05-29 16:17:11'),(20,1,'2026-05-29 16:16:59','2026-05-29 16:16:59'),(20,2,'2026-05-29 16:16:59','2026-05-29 16:16:59'),(20,3,'2026-05-29 16:16:59','2026-05-29 16:16:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_permissions`
--

LOCK TABLES `rbac_permissions` WRITE;
/*!40000 ALTER TABLE `rbac_permissions` DISABLE KEYS */;
INSERT INTO `rbac_permissions` VALUES (1,'控制台','/dashboard',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(2,'用户管理','/user_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(3,'分类管理','/category_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(4,'商品管理','/goods_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(5,'订单管理','/order_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(6,'地址管理','/address_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(7,'门店管理','/store_manage',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(8,'系统管理','/system',1,NULL,NULL,0,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(9,'角色管理','/system/role',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(10,'菜单管理','/system/menu',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(11,'公告管理','/system/notice',1,NULL,NULL,8,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(12,'添加商品按钮','goods:add_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(13,'编辑商品按钮','goods:edit_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(14,'下架商品按钮','goods:delete_btn',2,NULL,NULL,4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(15,'权限分配按钮','user:assign_role_btn',2,NULL,NULL,2,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(16,'分配权限按钮','role:assign_perm_btn',2,NULL,NULL,9,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(17,'查询商品接口','api:goods:all',3,'/goods/','GET',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(18,'创建商品接口','api:goods:create',3,'/goods/','POST',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(19,'编辑商品接口','api:goods:update',3,'/goods/:id','PUT',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(20,'下架商品接口','api:goods:off',3,'/goods/off','POST',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(21,'上架商品接口','api:goods:on',3,'/goods/on','POST',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(22,'查询下架商品接口','api:goods:removal',3,'/goods/removal','POST',4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(23,'查询分类接口','api:category:all',3,'/category/','GET',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(24,'创建分类接口','api:category:create',3,'/category/','POST',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(25,'更新分类接口','api:category:update',3,'/category/:id','PUT',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(26,'删除分类接口','api:category:delete',3,'/category/:id','DELETE',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(27,'分类添加商品接口','api:category:add_goods',3,'/category/:id/goods','POST',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(28,'分类移除商品接口','api:category:remove_goods',3,'/category/:id/goods','DELETE',3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(29,'查询订单接口','api:order:all',3,'/order','POST',5,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(30,'删除订单接口','api:order:delete',3,'/order/:id','DELETE',5,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(31,'修改订单状态接口','api:order:update',3,'/order/:id','PATCH',5,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(32,'查询地址接口','api:address:all',3,'/address/findAll','POST',6,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(33,'查询门店接口','api:store:all',3,'/store/list','GET',7,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(34,'创建门店接口','api:store:create',3,'/store','POST',7,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(35,'更新门店接口','api:store:update',3,'/store/:id','PUT',7,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(36,'删除门店接口','api:store:delete',3,'/store/:id','DELETE',7,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(37,'首页概览统计接口','api:tj:summary',3,'/tj/summary','GET',1,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(38,'用户统计接口','api:tj:user_count',3,'/tj/user-count','POST',1,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(39,'商品统计接口','api:tj:goods_count',3,'/tj/goods-count','POST',1,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(40,'订单统计接口','api:tj:order_count',3,'/tj/order-count','POST',1,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(41,'查询所有用户接口','api:user:all',3,'/user/all','POST',2,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(42,'管理员添加用户接口','api:user:add',3,'/user/add','POST',2,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(43,'删除用户接口','api:user:delete',3,'/user/:id','DELETE',2,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(44,'查询公告接口','api:notice:list',3,'/notice/list','POST',11,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(45,'发布公告接口','api:notice:create',3,'/notice','POST',11,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(46,'更新公告接口','api:notice:update',3,'/notice/:id','PUT',11,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(47,'删除公告接口','api:notice:delete',3,'/notice/:id','DELETE',11,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(48,'所有接口权限','api:all',3,'*','*',0,'2026-05-29 16:13:10','2026-05-29 16:13:10');
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
INSERT INTO `rbac_role_permissions` VALUES (1,1),(1,2),(1,3),(2,3),(1,4),(2,4),(3,4),(1,5),(2,5),(3,5),(1,6),(1,7),(1,8),(2,8),(1,9),(2,9),(1,10),(2,10),(1,11),(2,11),(1,12),(2,12),(3,12),(1,13),(2,13),(3,13),(1,14),(2,14),(3,14),(1,15),(1,16),(2,16),(1,17),(2,17),(3,17),(1,18),(2,18),(3,18),(1,19),(2,19),(3,19),(1,20),(2,20),(3,20),(1,21),(2,21),(3,21),(1,22),(2,22),(3,22),(1,23),(2,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(2,29),(3,29),(1,30),(2,30),(3,30),(1,31),(2,31),(3,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(2,44),(1,45),(2,45),(1,46),(2,46),(1,47),(2,47),(1,48);
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
INSERT INTO `rbac_user_roles` VALUES (1,1),(2,2),(3,2),(4,2),(5,2),(6,2),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='规格组表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_group`
--

LOCK TABLES `spec_group` WRITE;
/*!40000 ALTER TABLE `spec_group` DISABLE KEYS */;
INSERT INTO `spec_group` VALUES (1,'杯型','2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(2,'甜度','2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(3,'温度','2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(4,'加料','2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(5,'奶底','2026-05-29 16:15:53','2026-05-29 16:15:53',NULL);
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
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `spec_option_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `spec_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='规格选项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_option`
--

LOCK TABLES `spec_option` WRITE;
/*!40000 ALTER TABLE `spec_option` DISABLE KEYS */;
INSERT INTO `spec_option` VALUES (1,1,'中型',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(2,1,'大型',3.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(3,1,'特大',6.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(4,2,'不另外加糖',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(5,2,'三分糖',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(6,2,'五分糖',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(7,2,'七分糖',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(8,2,'全糖',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(9,3,'常规冰',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(10,3,'少冰',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(11,3,'去冰',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(12,3,'热',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(13,3,'温',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(14,4,'无',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(15,4,'珍珠',2.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(16,4,'椰果',2.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(17,4,'布丁',3.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(18,4,'红豆',2.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(19,5,'标准牛奶',0.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(20,5,'燕麦奶',5.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(21,5,'脱脂奶',2.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL),(22,5,'厚椰乳',4.00,'2026-05-29 16:15:53','2026-05-29 16:15:53',NULL);
/*!40000 ALTER TABLE `spec_option` ENABLE KEYS */;
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COMMENT='门店表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,1,'测试门店 01','这是第 1 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 101 号','[\"08:00-23:59\",\"00:00-05:00\"]','2026-05-29 16:13:10','2026-05-29 16:39:10'),(2,1,'测试门店 02','这是第 2 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 102 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(3,1,'测试门店 03','这是第 3 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 103 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(4,1,'测试门店 04','这是第 4 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 104 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(5,1,'测试门店 05','这是第 5 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 105 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(6,1,'测试门店 06','这是第 6 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 106 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(7,1,'测试门店 07','这是第 7 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 107 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(8,1,'测试门店 08','这是第 8 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 108 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(9,1,'测试门店 09','这是第 9 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 109 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(10,1,'测试门店 10','这是第 10 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 110 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(11,1,'测试门店 11','这是第 11 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 111 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(12,1,'测试门店 12','这是第 12 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 112 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(13,1,'测试门店 13','这是第 13 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 113 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(14,1,'测试门店 14','这是第 14 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 114 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(15,1,'测试门店 15','这是第 15 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 115 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(16,1,'测试门店 16','这是第 16 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 116 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(17,1,'测试门店 17','这是第 17 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 117 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(18,1,'测试门店 18','这是第 18 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 118 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(19,1,'测试门店 19','这是第 19 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 119 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10'),(20,1,'测试门店 20','这是第 20 个自动化生成的测试门店，主要用于展示门店管理功能。','上海市浦东新区某某路 120 号','[\"08:00-12:00\",\"14:00-22:00\"]','2026-05-29 16:13:10','2026-05-29 16:13:10');
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
INSERT INTO `user_stores` VALUES (1,1,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,2,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,3,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,4,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,5,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,6,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,7,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,8,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,9,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,10,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,11,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,12,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,13,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,14,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,15,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,16,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,17,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,18,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,19,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(1,20,'2026-05-29 16:13:10','2026-05-29 16:13:10'),(2,19,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(3,11,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(4,18,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(5,4,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(6,13,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(7,6,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(8,18,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(9,12,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(10,20,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(11,14,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(12,5,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(13,19,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(14,11,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(15,17,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(16,20,'2026-05-29 16:19:37','2026-05-29 16:19:37');
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
INSERT INTO `users` VALUES (1,'超级管理员','https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','admin@example.com','admin','$2b$10$vXPasSsa0soI6Vlj4EFjEuVfcDHXLi1YfhPzYgt3I4ztlueXQZHTO',NULL,NULL,NULL,'2026-05-29 16:13:09','2026-05-29 16:13:09'),(2,'店长1号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager1','manager1@example.com','manager1','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(3,'店长2号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager2','manager2@example.com','manager2','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(4,'店长3号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager3','manager3@example.com','manager3','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(5,'店长4号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager4','manager4@example.com','manager4','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(6,'店长5号','https://api.dicebear.com/7.x/avataaars/svg?seed=manager5','manager5@example.com','manager5','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(7,'店员1号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff1','staff1@example.com','staff1','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(8,'店员2号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff2','staff2@example.com','staff2','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(9,'店员3号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff3','staff3@example.com','staff3','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(10,'店员4号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff4','staff4@example.com','staff4','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(11,'店员5号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff5','staff5@example.com','staff5','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(12,'店员6号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff6','staff6@example.com','staff6','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(13,'店员7号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff7','staff7@example.com','staff7','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(14,'店员8号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff8','staff8@example.com','staff8','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(15,'店员9号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff9','staff9@example.com','staff9','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(16,'店员10号','https://api.dicebear.com/7.x/avataaars/svg?seed=staff10','staff10@example.com','staff10','$2b$10$Z08qOA4Lf4jNrOLxEd6JpObx4jC.Y9Un9U9/JSHNWp8qEAdl.z8oq',NULL,NULL,NULL,'2026-05-29 16:19:37','2026-05-29 16:19:37'),(17,'益友会员','https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','','wx_1GbMbT2EnQ','','obUti5cbxUMb1fI5JU1GbMbT2EnQ',NULL,NULL,'2026-05-30 05:28:39','2026-05-30 05:28:39');
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

-- Dump completed on 2026-05-30 14:57:31
