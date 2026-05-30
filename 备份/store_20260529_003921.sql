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
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casbin_rule`
--

LOCK TABLES `casbin_rule` WRITE;
/*!40000 ALTER TABLE `casbin_rule` DISABLE KEYS */;
INSERT INTO `casbin_rule` VALUES (1,'p','admin','/dashboard','view',NULL,NULL,NULL),(2,'p','admin','/user_manage','view',NULL,NULL,NULL),(3,'p','admin','/goods_manage','view',NULL,NULL,NULL),(4,'p','admin','user:add_btn','use',NULL,NULL,NULL),(5,'p','admin','user:delete_btn','use',NULL,NULL,NULL),(6,'p','admin','/user/all','POST',NULL,NULL,NULL),(7,'p','admin','/user/change-password','PATCH',NULL,NULL,NULL),(8,'p','admin','/user/add','POST',NULL,NULL,NULL),(9,'p','admin','/category_manage','view',NULL,NULL,NULL),(10,'p','admin','goods:delete_btn','use',NULL,NULL,NULL),(11,'p','admin','/system','view',NULL,NULL,NULL),(12,'p','admin','/system/role','view',NULL,NULL,NULL),(13,'p','admin','/system/menu','view',NULL,NULL,NULL),(14,'p','admin','/category','POST',NULL,NULL,NULL),(15,'p','admin','/category/:id','PUT',NULL,NULL,NULL),(16,'p','admin','/category/:id','DELETE',NULL,NULL,NULL),(17,'p','admin','/user/change-user','PATCH',NULL,NULL,NULL),(18,'p','admin','/goods','POST',NULL,NULL,NULL),(19,'p','admin','/goods/:id','PUT',NULL,NULL,NULL),(20,'p','admin','/goods/off','POST',NULL,NULL,NULL),(21,'p','admin','/order_manage','view',NULL,NULL,NULL),(22,'p','admin','/address_manage','view',NULL,NULL,NULL),(23,'p','admin','/goods','GET',NULL,NULL,NULL),(24,'p','admin','/order','POST',NULL,NULL,NULL),(25,'p','admin','/address/findAll','POST',NULL,NULL,NULL),(26,'p','admin','/goods/on','POST',NULL,NULL,NULL),(27,'p','admin','/goods/removal','POST',NULL,NULL,NULL),(28,'p','admin','/category/','GET',NULL,NULL,NULL),(29,'p','admin','/category/:id/goods','POST',NULL,NULL,NULL),(30,'p','admin','/category/:id/goods','DELETE',NULL,NULL,NULL),(31,'p','admin','*','*',NULL,NULL,NULL),(32,'p','admin','goods:add_btn','use',NULL,NULL,NULL),(33,'p','admin','goods:edit_btn','use',NULL,NULL,NULL),(34,'p','admin','user:assign_role_btn','use',NULL,NULL,NULL),(35,'p','admin','role:assign_perm_btn','use',NULL,NULL,NULL),(36,'p','admin','/order/:id','DELETE',NULL,NULL,NULL),(37,'p','admin','/order/:id','PATCH',NULL,NULL,NULL),(38,'p','admin','/tj/summary','GET',NULL,NULL,NULL),(39,'p','admin','/tj/user-count','POST',NULL,NULL,NULL),(40,'p','admin','/tj/goods-count','POST',NULL,NULL,NULL),(41,'p','admin','/tj/order-count','POST',NULL,NULL,NULL),(42,'p','admin','/user/:id','DELETE',NULL,NULL,NULL),(43,'p','admin','/system/notice','view',NULL,NULL,NULL),(44,'p','admin','/notice/list','POST',NULL,NULL,NULL),(45,'p','admin','/notice','POST',NULL,NULL,NULL),(46,'p','admin','/notice/:id','PUT',NULL,NULL,NULL),(47,'p','admin','/notice/:id','DELETE',NULL,NULL,NULL),(48,'p','user_dz','/dashboard','view',NULL,NULL,NULL),(49,'p','user_dz','/user_manage','view',NULL,NULL,NULL),(50,'p','user_dz','/goods_manage','view',NULL,NULL,NULL),(51,'p','user_dz','user:add_btn','use',NULL,NULL,NULL),(52,'p','user_dz','user:delete_btn','use',NULL,NULL,NULL),(53,'p','user_dz','/user/all','POST',NULL,NULL,NULL),(54,'p','user_dz','/user/add','POST',NULL,NULL,NULL),(55,'p','user_dz','/category_manage','view',NULL,NULL,NULL),(56,'p','user_dz','goods:delete_btn','use',NULL,NULL,NULL),(57,'p','user_dz','/category','POST',NULL,NULL,NULL),(58,'p','user_dz','/category/:id','PUT',NULL,NULL,NULL),(59,'p','user_dz','/category/:id','DELETE',NULL,NULL,NULL),(60,'p','user_dz','/user/change-user','PATCH',NULL,NULL,NULL),(61,'p','user_dz','/goods','POST',NULL,NULL,NULL),(62,'p','user_dz','/goods/:id','PUT',NULL,NULL,NULL),(63,'p','user_dz','/goods/off','POST',NULL,NULL,NULL),(64,'p','user_dz','/order_manage','view',NULL,NULL,NULL),(65,'p','user_dz','/goods','GET',NULL,NULL,NULL),(66,'p','user_dz','/order','POST',NULL,NULL,NULL),(67,'p','user_dz','/goods/on','POST',NULL,NULL,NULL),(68,'p','user_dz','/goods/removal','POST',NULL,NULL,NULL),(69,'p','user_dz','/category/','GET',NULL,NULL,NULL),(70,'p','user_dz','/category/:id/goods','POST',NULL,NULL,NULL),(71,'p','user_dz','/category/:id/goods','DELETE',NULL,NULL,NULL),(72,'p','user_dz','goods:add_btn','use',NULL,NULL,NULL),(73,'p','user_dz','goods:edit_btn','use',NULL,NULL,NULL),(74,'p','user_dz','user:assign_role_btn','use',NULL,NULL,NULL),(75,'p','user_dz','role:assign_perm_btn','use',NULL,NULL,NULL),(76,'p','user_dz','/order/:id','DELETE',NULL,NULL,NULL),(77,'p','user_dz','/order/:id','PATCH',NULL,NULL,NULL),(78,'p','user_dz','/tj/summary','GET',NULL,NULL,NULL),(79,'p','user_dz','/tj/user-count','POST',NULL,NULL,NULL),(80,'p','user_dz','/tj/goods-count','POST',NULL,NULL,NULL),(81,'p','user_dz','/tj/order-count','POST',NULL,NULL,NULL),(82,'p','user_dz','/user/:id','DELETE',NULL,NULL,NULL),(83,'p','user_yg','/dashboard','view',NULL,NULL,NULL),(84,'p','user_yg','/goods_manage','view',NULL,NULL,NULL),(85,'p','user_yg','/category_manage','view',NULL,NULL,NULL),(86,'p','user_yg','goods:delete_btn','use',NULL,NULL,NULL),(87,'p','user_yg','/category','POST',NULL,NULL,NULL),(88,'p','user_yg','/category/:id','PUT',NULL,NULL,NULL),(89,'p','user_yg','/category/:id','DELETE',NULL,NULL,NULL),(90,'p','user_yg','/goods','POST',NULL,NULL,NULL),(91,'p','user_yg','/goods/:id','PUT',NULL,NULL,NULL),(92,'p','user_yg','/goods/off','POST',NULL,NULL,NULL),(93,'p','user_yg','/order_manage','view',NULL,NULL,NULL),(94,'p','user_yg','/goods','GET',NULL,NULL,NULL),(95,'p','user_yg','/order','POST',NULL,NULL,NULL),(96,'p','user_yg','/category/','GET',NULL,NULL,NULL),(97,'p','user_yg','/category/:id/goods','POST',NULL,NULL,NULL),(98,'p','user_yg','/category/:id/goods','DELETE',NULL,NULL,NULL),(99,'g','1','admin',NULL,NULL,NULL,NULL),(100,'g','2','user_dz',NULL,NULL,NULL,NULL);
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
  `icon` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,NULL,NULL,'2026-05-28 07:33:49','2026-05-28 07:33:49',NULL,'果饮'),(2,NULL,NULL,'2026-05-28 07:34:00','2026-05-28 07:34:00',NULL,'奶茶'),(3,NULL,NULL,'2026-05-28 07:34:17','2026-05-28 07:34:17',NULL,'咖啡');
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
  `goods_img` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'蜜桃四季春',8.00,99,'http://127.0.0.1:8800/online/4a6305e8-0720-4ce7-9361-f32a688d974b.jpg','2026-05-28 07:41:16','2026-05-28 07:41:16','2026-05-28 08:48:29'),(2,'蜜桃四季春',8.00,99,'http://127.0.0.1:8800/online/4a6305e8-0720-4ce7-9361-f32a688d974b.jpg','2026-05-28 07:43:12','2026-05-28 07:43:12',NULL),(3,'生椰拿铁',12.00,99,'http://127.0.0.1:8800/online/e398d308-03e3-4b1c-ab00-587c595efa54.png','2026-05-28 08:49:18','2026-05-28 08:53:22',NULL),(4,'椰子水',6.00,99,'http://127.0.0.1:8800/online/62a3d786-b630-4c17-b6e8-761a3dbab499.png','2026-05-28 08:53:50','2026-05-28 08:53:50',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_category`
--

LOCK TABLES `goods_category` WRITE;
/*!40000 ALTER TABLE `goods_category` DISABLE KEYS */;
INSERT INTO `goods_category` VALUES (1,2,1,'2026-05-28 07:43:12','2026-05-28 07:43:12',NULL),(2,3,3,'2026-05-28 08:49:18','2026-05-28 08:49:18',NULL),(3,4,1,'2026-05-28 08:53:50','2026-05-28 08:53:50',NULL);
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `icon` varchar(255) DEFAULT NULL COMMENT '公告图标',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='系统公告表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (2,'系统架构全面升级','全面升级为现代化的 RBAC 权限控制体系，支持细粒度的菜单及按钮',1,1,'Admin','2026-05-28 16:13:25','2026-05-28 16:13:25','InfoFilled');
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `goods_id` (`goods_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
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
  `address_id` int(11) NOT NULL COMMENT '地址id',
  `total_price` decimal(10,2) NOT NULL COMMENT '订单总价',
  `order_number` varchar(16) NOT NULL COMMENT '订单编号',
  `state` tinyint(4) NOT NULL COMMENT '订单状态',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_permissions`
--

LOCK TABLES `rbac_permissions` WRITE;
/*!40000 ALTER TABLE `rbac_permissions` DISABLE KEYS */;
INSERT INTO `rbac_permissions` VALUES (1,'控制台','/dashboard',1,NULL,NULL,0,'2026-05-27 13:51:19','2026-05-27 13:51:19'),(2,'用户管理','/user_manage',1,NULL,NULL,0,'2026-05-27 13:51:19','2026-05-27 13:51:19'),(3,'商品管理','/goods_manage',1,NULL,NULL,0,'2026-05-27 13:51:19','2026-05-27 13:51:19'),(4,'添加用户按钮','user:add_btn',2,NULL,NULL,2,'2026-05-27 13:51:19','2026-05-28 07:14:34'),(5,'删除用户按钮','user:delete_btn',2,NULL,NULL,2,'2026-05-27 13:51:19','2026-05-28 07:14:34'),(6,'查询用户接口','api:user:all',3,'/user/all','POST',2,'2026-05-27 13:51:19','2026-05-28 10:14:56'),(7,'修改密码接口','api:user:change-password',3,'/user/change-password','PATCH',0,'2026-05-27 13:51:19','2026-05-27 13:51:19'),(8,'创建用户接口','api:user:add',3,'/user/add','POST',2,'2026-05-27 14:43:13','2026-05-28 10:14:56'),(9,'分类管理','/category_manage',1,NULL,NULL,0,'2026-05-28 06:56:23','2026-05-28 06:56:23'),(12,'删除商品按钮','goods:delete_btn',2,NULL,NULL,3,'2026-05-28 06:56:23','2026-05-28 10:14:56'),(13,'系统管理','/system',1,NULL,NULL,0,'2026-05-28 07:00:50','2026-05-28 07:00:50'),(14,'角色管理','/system/role',1,NULL,NULL,13,'2026-05-28 07:00:50','2026-05-28 10:14:56'),(15,'菜单管理','/system/menu',1,NULL,NULL,13,'2026-05-28 07:00:50','2026-05-28 10:14:56'),(16,'创建分类接口','api:category:create',3,'/category','POST',9,'2026-05-28 07:12:57','2026-05-28 10:14:56'),(17,'更新分类接口','api:category:update',3,'/category/:id','PUT',9,'2026-05-28 07:12:57','2026-05-28 10:14:56'),(18,'删除分类接口','api:category:delete',3,'/category/:id','DELETE',9,'2026-05-28 07:12:57','2026-05-28 10:14:56'),(19,'修改用户接口','api:user:change',3,'/user/change-user','PATCH',2,'2026-05-28 07:14:34','2026-05-28 07:14:34'),(20,'创建商品接口','api:goods:create',3,'/goods','POST',3,'2026-05-28 07:14:34','2026-05-28 10:14:56'),(21,'修改商品接口','api:goods:update',3,'/goods/:id','PUT',3,'2026-05-28 07:14:34','2026-05-28 10:14:56'),(22,'下架商品接口','api:goods:off',3,'/goods/off','POST',3,'2026-05-28 07:14:34','2026-05-28 10:14:56'),(23,'订单管理','/order_manage',1,NULL,NULL,0,'2026-05-28 07:30:09','2026-05-28 07:30:09'),(24,'地址管理','/address_manage',1,NULL,NULL,0,'2026-05-28 07:30:09','2026-05-28 07:30:09'),(25,'查询商品接口','api:goods:all',3,'/goods','GET',3,'2026-05-28 07:30:09','2026-05-28 10:14:56'),(26,'查询订单接口','api:order:all',3,'/order','POST',23,'2026-05-28 07:30:09','2026-05-28 10:14:56'),(27,'查询地址接口','api:address:all',3,'/address/findAll','POST',24,'2026-05-28 07:30:09','2026-05-28 10:14:56'),(28,'上架商品接口','api:goods:on',3,'/goods/on','POST',3,'2026-05-28 07:43:06','2026-05-28 10:14:56'),(29,'查询下架商品接口','api:goods:removal',3,'/goods/removal','POST',3,'2026-05-28 07:43:06','2026-05-28 10:14:56'),(30,'查询分类接口','api:category:all',3,'/category/','GET',9,'2026-05-28 07:43:06','2026-05-28 10:14:56'),(31,'分类添加商品接口','api:category:add_goods',3,'/category/:id/goods','POST',9,'2026-05-28 07:43:06','2026-05-28 10:14:56'),(32,'分类移除商品接口','api:category:remove_goods',3,'/category/:id/goods','DELETE',9,'2026-05-28 07:43:06','2026-05-28 10:14:56'),(33,'所有接口权限','api:all',3,'*','*',0,'2026-05-28 07:43:06','2026-05-28 07:43:06'),(34,'添加商品按钮','goods:add_btn',2,NULL,NULL,3,'2026-05-28 07:54:34','2026-05-28 10:14:56'),(35,'编辑商品按钮','goods:edit_btn',2,NULL,NULL,3,'2026-05-28 07:54:34','2026-05-28 10:14:56'),(36,'分配角色按钮','user:assign_role_btn',2,NULL,NULL,2,'2026-05-28 07:54:34','2026-05-28 10:14:56'),(37,'分配权限按钮','role:assign_perm_btn',2,NULL,NULL,8,'2026-05-28 07:54:34','2026-05-28 07:54:34'),(38,'删除订单接口','api:order:delete',3,'/order/:id','DELETE',23,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(39,'修改订单状态接口','api:order:update',3,'/order/:id','PATCH',23,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(40,'首页概览统计接口','api:tj:summary',3,'/tj/summary','GET',1,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(41,'用户统计接口','api:tj:user_count',3,'/tj/user-count','POST',1,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(42,'商品统计接口','api:tj:goods_count',3,'/tj/goods-count','POST',1,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(43,'订单统计接口','api:tj:order_count',3,'/tj/order-count','POST',1,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(44,'删除用户接口','api:user:delete',3,'/user/:id','DELETE',2,'2026-05-28 09:48:27','2026-05-28 10:14:56'),(45,'公告管理','/system/notice',1,NULL,NULL,13,'2026-05-28 09:58:23','2026-05-28 09:58:23'),(46,'查询公告接口','api:notice:list',3,'/notice/list','POST',45,'2026-05-28 09:58:23','2026-05-28 10:14:56'),(47,'发布公告接口','api:notice:create',3,'/notice','POST',45,'2026-05-28 09:58:23','2026-05-28 10:14:56'),(48,'更新公告接口','api:notice:update',3,'/notice/:id','PUT',45,'2026-05-28 09:58:23','2026-05-28 10:14:56'),(49,'删除公告接口','api:notice:delete',3,'/notice/:id','DELETE',45,'2026-05-28 09:58:23','2026-05-28 10:14:56');
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
INSERT INTO `rbac_role_permissions` VALUES (1,1),(3,1),(4,1),(1,2),(3,2),(1,3),(3,3),(4,3),(1,4),(3,4),(1,5),(3,5),(1,6),(3,6),(1,7),(1,8),(3,8),(1,9),(3,9),(4,9),(1,12),(3,12),(4,12),(1,13),(1,14),(1,15),(1,16),(3,16),(4,16),(1,17),(3,17),(4,17),(1,18),(3,18),(4,18),(1,19),(3,19),(1,20),(3,20),(4,20),(1,21),(3,21),(4,21),(1,22),(3,22),(4,22),(1,23),(3,23),(4,23),(1,24),(1,25),(3,25),(4,25),(1,26),(3,26),(4,26),(1,27),(1,28),(3,28),(1,29),(3,29),(1,30),(3,30),(4,30),(1,31),(3,31),(4,31),(1,32),(3,32),(4,32),(1,33),(1,34),(3,34),(1,35),(3,35),(1,36),(3,36),(1,37),(3,37),(1,38),(3,38),(1,39),(3,39),(1,40),(3,40),(1,41),(3,41),(1,42),(3,42),(1,43),(3,43),(1,44),(3,44),(1,45),(1,46),(1,47),(1,48),(1,49);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rbac_roles`
--

LOCK TABLES `rbac_roles` WRITE;
/*!40000 ALTER TABLE `rbac_roles` DISABLE KEYS */;
INSERT INTO `rbac_roles` VALUES (1,'超级管理员','admin',1,'拥有所有权限','2026-05-27 13:51:19','2026-05-27 13:51:19'),(2,'普通用户','common_user',1,'仅拥有基础查看权限','2026-05-27 13:51:19','2026-05-27 13:51:19'),(3,'店长','user_dz',1,'店长','2026-05-28 07:45:22','2026-05-28 07:45:34'),(4,'员工','user_yg',1,'员工','2026-05-28 07:45:59','2026-05-28 07:45:59');
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
INSERT INTO `rbac_user_roles` VALUES (1,1),(2,3);
/*!40000 ALTER TABLE `rbac_user_roles` ENABLE KEYS */;
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `openid` varchar(255) DEFAULT NULL COMMENT '微信小程序openid',
  `unionid` varchar(255) DEFAULT NULL COMMENT '微信unionid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `user_name_2` (`user_name`),
  UNIQUE KEY `openid` (`openid`),
  UNIQUE KEY `unionid` (`unionid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'管理员','http://example.com/avatar.jpg','admin@example.com','admin','$2b$10$dPbY1TCT/N8/1Qg/8Cw/O.fYKbEvQvKAj375aQo6cnW6HBKMylF5m','2026-05-27 13:51:19','2026-05-27 14:43:14',NULL,NULL),(2,'用户1','http://47.119.172.215:9988/online/0008cbace240eee93a3327500.jpg','255474348@qq.com','255474348','$2b$10$MWuAcYV7ZdORwcoJXQOPcOYxUZzAz3OMRFrqRFwFVI30m1DX08UNS','2026-05-27 14:46:52','2026-05-27 14:46:52',NULL,NULL);
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

-- Dump completed on 2026-05-29  0:39:36
