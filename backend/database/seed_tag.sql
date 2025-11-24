-- Seed file to populate the `tag` table with predefined tags
-- Generated: 2025-11-24

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_TIME_ZONE=@@TIME_ZONE;
SET TIME_ZONE='+00:00';

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO tag (name) VALUES
('Abnormal Psychology'),('Agile'),('Algebra'),('Anatomy'),('Angular'),('Audio Engineering'),('Auditing'),('Biochemistry'),('Biology Lab'),('Broadcast Production'),('C#'),('C++'),('Case Study Analysis'),('Cell Biology'),('Chemical Processes'),('Circuit Analysis'),('Cognitive Psychology'),('Counseling Techniques'),('Culinary Arts'),('Data Structures'),('Differential Equations'),('Ecology'),('Electromagnetism'),('Ethics'),('Ethics and Morality'),('Express.js'),('Film Theory'),('Final Exam Prep'),('Financial Accounting'),('Flowcharts'),('Food & Beverage Management'),('Front Office Operations'),('Genetics'),('Git'),('GoLang'),('Graphic Design'),('Group Study'),('Historical Research'),('Homework Help'),('Hotel Management'),('Inorganic Chemistry'),('Investment Analysis'),('Java'),('JIRA'),('Kotlin'),('Literary Analysis'),('Literature Review'),('Macroeconomics'),('Marketing Strategy'),('Microeconomics'),('Modern Literature'),('MongoDB'),('Node.js'),('Nutrition'),('Oral Defense'),('Organic Chemistry'),('Philosophy'),('Physics I'),('Physics Lab'),('Physiology'),('Poetry Analysis'),('Political Science'),('Presentation Practice'),('Prototyping'),('Quantum Physics'),('Quiz Drill'),('Research Methods'),('Scientific Method'),('Scriptwriting'),('Scrum'),('Service Quality'),('Social Science Theory'),('Sociology'),('SQL Server'),('Statics'),('Statistical Analysis'),('Stoichiometry'),('Supply Chain'),('Swift'),('Taxation'),('Thermodynamics'),('Thesis Writing'),('Tourism Planning'),('Trigonometry'),('UML'),('Vector Calculus'),('Version Control'),('Video Editing'),('Visual Arts'),('Vue.js'),('Waterfall'),('World History');

UNLOCK TABLES;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET TIME_ZONE=@OLD_TIME_ZONE;

