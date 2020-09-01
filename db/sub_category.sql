-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Sep 2020 um 07:47
-- Server-Version: 5.7.14
-- PHP-Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `antshop3`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sub_category`
--

CREATE TABLE `sub_category` (
  `id` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `SubCategoryID` int(15) DEFAULT NULL,
  `SubCategoryName` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Description` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Tag` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Picture` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Active` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `sub_category`
--

INSERT INTO `sub_category` (`id`, `CategoryID`, `SubCategoryID`, `SubCategoryName`, `Description`, `Tag`, `Picture`, `Active`, `createdAt`, `updatedAt`) VALUES
(59, 9, 59, 'Soap box', 'Soap box', '90007', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(71, 9, 71, 'Mat', 'Mat', '900064', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(90, 14, 90, 'Bath trap', 'Bath trap', '1400077', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(91, 14, 91, 'Bidet siphon', 'Bidet siphon', '1400085', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(92, 14, 92, 'Siphon for the pallet', 'Siphon for the pallet', '1400090', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(93, 14, 93, 'Urinal siphon', 'Urinal siphon', '1400099', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(94, 14, 94, 'Lattices / inserts', 'Lattices / inserts', '14000112', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(95, 14, 95, 'Siphons for a kitchen sink / life. technicians', 'Siphons for a kitchen sink / life. technicians', '14000116', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(96, 14, 96, 'Bottom valves', 'Bottom valves', '14000117', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(97, 14, 97, 'Ladders and trays', 'Ladders and trays', '14000121', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(98, 15, 98, 'Accessories (heated towel rails)', 'Accessories (heated towel rails)', '1500058', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(99, 15, 99, 'Heated towel rail', 'Heated towel rail', '15000110', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(100, 17, 100, 'Kitchen sink', 'Kitchen sink', '1700029', NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(115, 25, 250, 'Test Category1', 'Category Description', NULL, NULL, NULL, '2020-09-01 09:35:08', '2020-09-01 09:37:58'),
(117, 25, 251, 'Test Category1', 'Category Description', NULL, NULL, NULL, '2020-09-01 09:38:07', '2020-09-01 09:38:07');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `sub_category`
--
ALTER TABLE `sub_category`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `sub_category`
--
ALTER TABLE `sub_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
