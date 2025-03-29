-- MySQL dump 10.13  Distrib 8.4.3, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: bondvoyage_db
-- ------------------------------------------------------
-- Server version	8.4.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'4bstravelandtours@gmail.com','0680ca7e3e9b3b7dfafaf52b4a55179785689364f87829dbe6faae005603a595','2025-01-10 03:30:39');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;

--
-- Table structure for table `create_travel`
--

DROP TABLE IF EXISTS `create_travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `create_travel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `travel_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `share_code` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `share_code` (`share_code`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `create_travel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `create_travel`
--

/*!40000 ALTER TABLE `create_travel` DISABLE KEYS */;
INSERT INTO `create_travel` VALUES (5,1,'ASDASDDA','990RAJW0','2025-01-24 01:50:29');
/*!40000 ALTER TABLE `create_travel` ENABLE KEYS */;

--
-- Table structure for table `customized_intineraries`
--

DROP TABLE IF EXISTS `customized_intineraries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customized_intineraries` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `client_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `destination` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lodging` text COLLATE utf8mb4_general_ci,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `travel_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customized_intineraries`
--

/*!40000 ALTER TABLE `customized_intineraries` DISABLE KEYS */;
INSERT INTO `customized_intineraries` VALUES (16,'2025-01-18 22:15:35','Virginia Rose Dichoso','HAHAHAHAHAHAH','ASDADA','2025-01-19 00:00:00','2025-01-19 00:00:00',2),(18,'2025-01-18 23:31:05','Virginia Rose Dichoso','NYORK NYORK','HAHAHAHHA','2025-01-28 00:00:00','2025-01-30 00:00:00',3),(19,'2025-01-19 00:08:52','Virginia Rose Dichoso','Sagada','','2025-01-19 00:00:00','2025-01-21 00:00:00',1);
/*!40000 ALTER TABLE `customized_intineraries` ENABLE KEYS */;

--
-- Table structure for table `customized_intinerary_days`
--

DROP TABLE IF EXISTS `customized_intinerary_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customized_intinerary_days` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `customized_initerary_id` int NOT NULL,
  `activity` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_number` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customized_intinerary_days`
--

/*!40000 ALTER TABLE `customized_intinerary_days` DISABLE KEYS */;
INSERT INTO `customized_intinerary_days` VALUES (152,'2025-01-19 18:56:27',19,'hahaha','03:56:00','04:56:00',1,'2025-01-19 00:00:00'),(153,'2025-01-19 18:56:27',19,NULL,NULL,NULL,3,'2025-01-20 00:00:00'),(154,'2025-01-19 18:56:27',19,NULL,NULL,NULL,3,'2025-01-21 00:00:00');
/*!40000 ALTER TABLE `customized_intinerary_days` ENABLE KEYS */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Wow. Thanks!','2025-01-13 18:12:15'),(2,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Take 2','2025-01-13 18:20:04'),(3,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Take 3','2025-01-13 18:20:58'),(4,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Take 4','2025-01-13 18:25:51'),(5,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Take 5','2025-01-13 18:31:55'),(6,'Virginia Rose Dichoso','virginiarosedichoso@gmail.com','Wow!','2025-01-13 21:20:13');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;

--
-- Table structure for table `itineraries`
--

DROP TABLE IF EXISTS `itineraries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itineraries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  `duration_nights` int DEFAULT NULL,
  `lodging` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itineraries`
--

/*!40000 ALTER TABLE `itineraries` DISABLE KEYS */;
INSERT INTO `itineraries` VALUES (2,'Baguio',2,1,'Hotel'),(8,'Vigan',2,1,'Vigan Plaza Hotel'),(9,'Ilocos',1,1,'Fort Ilocandia Resort Hotel'),(10,'AA',1,5,'A'),(11,'JA',1,0,'G'),(12,'AA',1,0,'A'),(13,'A',1,0,'D'),(14,'bb',1,0,'b'),(16,'Sapporo, Japan',3,2,'HEY Hotel');
/*!40000 ALTER TABLE `itineraries` ENABLE KEYS */;

--
-- Table structure for table `itinerary_days`
--

DROP TABLE IF EXISTS `itinerary_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerary_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itinerary_id` int NOT NULL,
  `day_number` int NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `activity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `itinerary_id` (`itinerary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerary_days`
--

/*!40000 ALTER TABLE `itinerary_days` DISABLE KEYS */;
INSERT INTO `itinerary_days` VALUES (2,2,1,'00:00:00','10:00:00','Meet Up'),(3,2,2,'00:00:00','10:00:00','Run'),(8,8,1,'08:00:00','21:00:00','Meet Up'),(9,8,1,'09:00:00','10:00:00','Hiking'),(10,8,1,'10:00:00','10:30:00','Break'),(11,8,1,'10:30:00','11:30:00','Swimming'),(12,8,1,'11:30:00','23:59:00','Free time'),(13,8,2,'08:00:00','09:00:00','Run'),(14,8,2,'09:00:00','10:00:00','Swimming'),(15,8,2,'10:00:00','10:30:00','Break'),(16,8,2,'10:30:00','11:30:00','Hiking'),(17,8,2,'11:30:00','23:59:00','Free time'),(18,9,1,'12:00:00','23:59:00','Shopping'),(19,10,1,'17:06:00','18:06:00','A'),(20,11,1,'00:00:00','00:00:00',''),(21,14,1,'01:09:00','02:09:00','a'),(22,16,3,'00:00:00','00:00:00','');
/*!40000 ALTER TABLE `itinerary_days` ENABLE KEYS */;

--
-- Table structure for table `place_images`
--

DROP TABLE IF EXISTS `place_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `place_id` int NOT NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `place_id` (`place_id`),
  CONSTRAINT `place_images_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place_images`
--

/*!40000 ALTER TABLE `place_images` DISABLE KEYS */;
INSERT INTO `place_images` VALUES (1,1,'../uploads/6785961c1c213_paoay-church-4.JPG'),(2,1,'../uploads/6785961c51d20_paoay-church-3.jpg'),(3,1,'../uploads/6785961cbdfec_paoay-church-2.png'),(4,1,'../uploads/6785961d74975_paoay-church-1.jpg'),(5,2,'../uploads/678633940ba74_Burnham-park3.jpg'),(6,2,'../uploads/67863395c832f_Burnham-park2.jpg'),(7,2,'../uploads/6786339611bab_Burnham-park1.jpg'),(8,2,'../uploads/67863397926b3_Burnham-park.jpg'),(9,3,'../uploads/678634ad680e9_calle crisologo.jpg'),(10,4,'../uploads/6786356a2a38f_Mayon.jpg');
/*!40000 ALTER TABLE `place_images` ENABLE KEYS */;

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `places` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `place_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `activities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `places`
--

/*!40000 ALTER TABLE `places` DISABLE KEYS */;
INSERT INTO `places` VALUES (1,'Ilocos','San Agustin Church of Paoay','Marcos Ave, Paoay, Ilocos Norte','Paoay Church is a Roman Catholic church in Paoay, Ilocos Norte province, completed in 1710 after two decades of construction. With a massive pediment and complementary bell tower standing imposingly on an expansive plain, the church is famous for its architecture that blends baroque, gothic, Chinese, and Javanese styles. Today, it is one of the top tourist attractions in the Ilocos Region.','Religious Services (Masses, Novena Services, Sacrament of Confession)\r\nCultural and Heritage Tours\r\nEducational and Spiritual Workshops\r\nHeritage and Arts Exhibits\r\nLocal Craft and Souvenir Sales','2025-01-13 22:39:23'),(2,'Baguio','Burnham Park','Jose Abad Santos Dr, Baguio, 2600 Benguet','Burnham Park, officially known as the Burnham Park Reservation, is a historic urban park located in downtown Baguio, Philippines.','Dog park\r\nPicnic tables available\r\nPlayground swings','2025-01-14 09:51:15'),(3,'Vigan-Baguio','Calle Crisologo','Calle Crisologo','Calle Crisologo is Vigan’s most popular tourist attraction and is the highlight of a Vigan City tour. The grounds and pavements of this preserved street are made of cobblestones, and both sides are lined with ancestral houses that are reminiscent of old Spanish towns.','Souvenir shopping\r\nNative food products','2025-01-14 09:55:57'),(4,'Bicol','Mayon Volcano','Bicol','Mayon, also known as Mount Mayon and Mayon Volcano is an active stratovolcano in the province of Albay in Bicol, Philippines. A popular tourist spot, it is renowned for its \"perfect cone\" because of its symmetric conical shape, and is regarded as sacred in Philippine mythology.','Sightseeing','2025-01-14 09:59:06');
/*!40000 ALTER TABLE `places` ENABLE KEYS */;

--
-- Table structure for table `travel_collaborators`
--

DROP TABLE IF EXISTS `travel_collaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_collaborators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `travel_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `travel_id` (`travel_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `travel_collaborators_ibfk_1` FOREIGN KEY (`travel_id`) REFERENCES `create_travel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `travel_collaborators_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_collaborators`
--

/*!40000 ALTER TABLE `travel_collaborators` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_collaborators` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `birthday` date NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_question_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_answer_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_question_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_answer_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_question_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `security_answer_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Virginia Rose','Dichoso','virginiarosedichoso@gmail.com','09064815090','2003-01-04','$2y$10$hbglgRDQ9GqpHtWBhj2U/O1osolsI3j8XiK1OODera7U/2jSRDz5e','friend','$2y$10$Wo8A6kTQRBtReJtgCnQt2.Em1Letci6xb09c/dHZGxUc7Nw5m38jm','toy','$2y$10$HB0nb2lMkQS9Dj5nqQZFF.Fp1RBaG3wnWAK9bJRtmLVjBxbnc25bi','character','$2y$10$SwEfZU4eYy0JCdjCyJ.H/OU.OApe1ZSnhitV0.sAqkcGWDwPtGC0.','2025-01-12 07:42:27'),(2,'Tony','Stark','tonystark@gmail.com','09064815090','2003-01-04','$2y$10$IHYZBwWx2HOuRCKyIwRgu..fCGHUNzdHITPkWprIYRfLYiFA38O66','movie','$2y$10$egON3O5VMBmyyzSGhI3zy.DnfkZSeUayL.r01E6Brli2UFsF.vjNe','friend','$2y$10$FbUxP92BSMWAJDj1M8OtjOyeJiqmaHdthLm8gXHsNpL2oKg6W4Wqy','character','$2y$10$0KS8FjAj7M0/41khNkBCWe0LJnvr4S6jE.UHKdQ6x8458pKyct2Zq','2025-01-12 08:56:33'),(3,'Steve','Rogers','steverogers@gmail.com','09064815090','2003-01-04','$2y$10$dvF2Qqpny9Vp.EjTJQCwNuEkMzbNn2g5REFafBsJBxd9MROz.4Ryy','movie','$2y$10$bX1oxk//b6hgM6umL03bneJ46yVjqaZUS/X12l7KJ95KdlNzRGpcG','friend','$2y$10$Wi.ojVHXJ5nwwTdBif1h8OKSHnv.edvju5tav3suv3mTBMH0ypCwu','character','$2y$10$v/xt1pxxcuGVrPW/E.XuIehruVD8EjolNInHAKjZq/frQG/WX7QLu','2025-01-12 19:18:33'),(5,'Ayumi','Hidalgo','ayumihidalgo@gmail.com','09946311236','2009-12-27','$2y$10$GTCsfBnLabLnDcgL3xxhLOEotFRBf.t9vrbH74a/uDh6Wk2wLYeda','movie','$2y$10$1s/eXaAN.3v0nCXOMN8kje46pDzmJybIls9sptn23LWxl8Auw0OI.','friend','$2y$10$RxTBB5cYyUXXfbMuyf/k..lzn/gpmFJ5tJHQssUEKNYFhYvYW85dO','purchase','$2y$10$dLGVBoOwUtk834f8bytTJOshqZUotIKlfJttfQZmXoNfjpI49x54y','2025-01-16 06:42:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'bondvoyage_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-24 14:51:14
