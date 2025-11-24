-- Seed file to populate the `tag` table with predefined tags
-- Generated: 2025-11-24

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_TIME_ZONE=@@TIME_ZONE;
SET TIME_ZONE='+00:00';

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (2,'Abnormal Psychology'),(84,'Agile'),(94,'Algebra'),(165,'Anatomy'),(79,'Angular'),(14,'Audio Engineering'),(23,'Auditing'),(153,'Biochemistry'),(99,'Biology Lab'),(13,'Broadcast Production'),(74,'C#'),(34,'C++'),(93,'Case Study Analysis'),(148,'Cell Biology'),(30,'Chemical Processes'),(32,'Circuit Analysis'),(1,'Cognitive Psychology'),(7,'Counseling Techniques'),(17,'Culinary Arts'),(33,'Data Structures'),(28,'Differential Equations'),(152,'Ecology'),(150,'Electromagnetism'),(162,'Ethics'),(6,'Ethics and Morality'),(81,'Express.js'),(11,'Film Theory'),(36,'Final Exam Prep'),(21,'Financial Accounting'),(91,'Flowcharts'),(15,'Food & Beverage Management'),(16,'Front Office Operations'),(151,'Genetics'),(88,'Git'),(75,'GoLang'),(9,'Graphic Design'),(38,'Group Study'),(157,'Historical Research'),(39,'Homework Help'),(19,'Hotel Management'),(98,'Inorganic Chemistry'),(102,'Investment Analysis'),(35,'Java'),(89,'JIRA'),(76,'Kotlin'),(156,'Literary Analysis'),(104,'Literature Review'),(27,'Macroeconomics'),(24,'Marketing Strategy'),(26,'Microeconomics'),(159,'Modern Literature'),(82,'MongoDB'),(80,'Node.js'),(167,'Nutrition'),(103,'Oral Defense'),(97,'Organic Chemistry'),(161,'Philosophy'),(100,'Physics I'),(29,'Physics Lab'),(166,'Physiology'),(160,'Poetry Analysis'),(164,'Political Science'),(41,'Presentation Practice'),(92,'Prototyping'),(149,'Quantum Physics'),(37,'Quiz Drill'),(3,'Research Methods'),(155,'Scientific Method'),(10,'Scriptwriting'),(85,'Scrum'),(20,'Service Quality'),(5,'Social Science Theory'),(163,'Sociology'),(83,'SQL Server'),(101,'Statics'),(4,'Statistical Analysis'),(154,'Stoichiometry'),(25,'Supply Chain'),(77,'Swift'),(22,'Taxation'),(31,'Thermodynamics'),(40,'Thesis Writing'),(18,'Tourism Planning'),(95,'Trigonometry'),(90,'UML'),(96,'Vector Calculus'),(87,'Version Control'),(8,'Video Editing'),(12,'Visual Arts'),(78,'Vue.js'),(86,'Waterfall'),(158,'World History');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET TIME_ZONE=@OLD_TIME_ZONE;

