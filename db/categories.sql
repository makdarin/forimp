-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Sep 2020 um 07:46
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
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `CategoryID` int(15) DEFAULT NULL,
  `CategoryName` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Slug` varchar(200) DEFAULT NULL,
  `Description` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Tag` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Picture` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Active` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `categories`
--

INSERT INTO `categories` (`id`, `CategoryID`, `CategoryName`, `Slug`, `Description`, `Tag`, `Picture`, `Active`, `createdAt`, `updatedAt`) VALUES
(2, 2, 'Инсталляционные системы', 'installation-systems', 'Installation systems', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(3, 3, 'Наборы с керамикой', 'sets-with-ceramics', 'Sets with ceramics', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(4, 4, 'Смесители', 'faucets', 'Faucets', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(5, 5, 'Ванны', 'bath', 'Bathtubs', NULL, NULL, NULL, '2020-09-01 00:00:00', '2020-09-01 00:00:00'),
(6, 6, 'Душ. кабины /Душ. боксы / Поддоны', 'shower-cabin-boxes-pallet', 'Shower. Cabin / Shower. Boxes / Pallets', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(7, 7, 'Плитка', 'tile', 'Tile', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(8, 8, 'Мебель', 'furniture', 'Furniture', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(9, 9, 'Аксессуары', 'accessories', 'Accessories', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(10, 10, 'Канализация / Водоснабжение', 'sewerage-water-supply', 'Sewerage / Water Supply', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(11, 11, 'Прочее', 'other', 'Other', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(13, 13, 'Зеркала', 'mirrors', 'Mirrors', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(14, 14, 'Водоотводные системы', 'drainage-systems', 'Drainage systems', NULL, NULL, NULL, '2020-09-01 00:00:00', '2020-09-01 00:00:00'),
(15, 15, 'Полотенцесушители', 'towel-warmers', 'Towel warmers', NULL, NULL, NULL, '2020-09-01 00:00:00', '2020-09-01 00:00:00'),
(16, 16, 'Отопление / Горячая вода', 'heating-hot-water', 'Heating / Hot water', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(17, 17, 'Кухонные изделия', 'kitchen-products', 'Kitchen products', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(18, 18, 'Оcвещение', 'lighting', 'Ceramics', NULL, NULL, NULL, '2020-05-12 00:00:00', '2020-05-12 00:00:00'),
(23, 200, 'Test Category1', NULL, 'Category Description', NULL, NULL, NULL, '2020-09-01 09:20:59', '2020-09-01 09:23:45'),
(24, 201, 'Test Category1', NULL, 'Category Description', NULL, NULL, NULL, '2020-09-01 09:23:59', '2020-09-01 09:23:59');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
