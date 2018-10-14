-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 14, 2018 at 10:50 AM
-- Server version: 5.7.23-0ubuntu0.16.04.1
-- PHP Version: 7.0.32-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loyalty`
--

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE `Customer` (
  `customerId` int(11) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`customerId`, `gender`, `date_of_birth`, `full_name`) VALUES
(10, 'male', NULL, 'The Black Cat'),
(11, 'female', NULL, 'The Black Dog');

-- --------------------------------------------------------

--
-- Table structure for table `Exchange`
--

CREATE TABLE `Exchange` (
  `exchangeId` int(11) NOT NULL,
  `publisherId` int(11) DEFAULT NULL,
  `traderId` int(11) DEFAULT NULL,
  `availablePointID` int(11) DEFAULT NULL,
  `availablePointAmount` int(11) DEFAULT NULL,
  `wantingPointID` int(11) DEFAULT NULL,
  `wantingPointAmount` int(11) DEFAULT NULL,
  `isApproved` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `expiredTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Exchange`
--

INSERT INTO `Exchange` (`exchangeId`, `publisherId`, `traderId`, `availablePointID`, `availablePointAmount`, `wantingPointID`, `wantingPointAmount`, `isApproved`, `createdAt`, `updatedAt`, `expiredTime`) VALUES
(12, 11, 11, 6, 10, 0, 5, 1, '2018-10-13 17:41:52', '2018-10-13', NULL),
(13, 10, 10, 0, 20, 5, 10, 1, '2018-10-13 19:20:32', '2018-10-14', NULL),
(14, 10, 11, 5, 20, 0, 10, 1, '2018-10-13 19:21:59', '2018-10-14', NULL),
(15, 10, 11, 5, 20, 0, 15, 1, '2018-10-13 19:23:23', '2018-10-14', NULL),
(16, 10, NULL, 5, 6, 0, 4, 0, '2018-10-13 19:30:56', '2018-10-13', NULL),
(17, 10, NULL, 5, 6, 0, 10, 0, '2018-10-13 19:50:16', '2018-10-13', NULL),
(18, 11, 11, 5, 20, 0, 10, 1, '2018-10-14 02:02:00', '2018-10-14', NULL),
(19, 11, NULL, 5, 20, 0, 10, 0, '2018-10-14 02:06:43', '2018-10-14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Point`
--

CREATE TABLE `Point` (
  `PointID` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Point`
--

INSERT INTO `Point` (`PointID`, `amount`, `name`) VALUES
(0, NULL, 'thupham'),
(5, NULL, 'HighLand'),
(6, NULL, 'phoenix');

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `productId` int(11) NOT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `shopId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gainPointId` int(11) DEFAULT NULL,
  `gainPointMount` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Shop`
--

CREATE TABLE `Shop` (
  `shopId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `reward` int(11) NOT NULL DEFAULT '10',
  `discount` int(11) DEFAULT NULL,
  `PointID` int(11) DEFAULT NULL,
  `pointNeedToCashout` int(11) NOT NULL DEFAULT '0',
  `availableCoinAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Shop`
--

INSERT INTO `Shop` (`shopId`, `name`, `location`, `reward`, `discount`, `PointID`, `pointNeedToCashout`, `availableCoinAmount`) VALUES
(8, 'Taka-Taka', NULL, 1, 20, 0, 123, NULL),
(9, 'BuFo', NULL, 1, 20, 6, 20, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Transaction`
--

CREATE TABLE `Transaction` (
  `transactionId` int(11) NOT NULL,
  `senderId` int(11) DEFAULT NULL,
  `recepientId` int(11) DEFAULT NULL,
  `transactionType` varchar(255) DEFAULT NULL,
  `PointID` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Transaction`
--

INSERT INTO `Transaction` (`transactionId`, `senderId`, `recepientId`, `transactionType`, `PointID`, `amount`, `createdAt`, `updatedAt`) VALUES
(14, 10, 11, 'Trading', 6, 4, '2018-10-13 09:30:48', '2018-10-13 09:30:48'),
(15, 8, 10, 'Reward', 0, 1, '2018-10-13 15:39:37', '2018-10-13 15:39:37'),
(16, 8, 11, 'Reward', 0, 1, '2018-10-13 15:41:03', '2018-10-13 15:41:03'),
(17, 11, 11, 'Exchange', 6, 10, '2018-10-13 19:14:44', '2018-10-13 19:14:44'),
(18, 11, 11, 'Exchange', 0, 5, '2018-10-13 19:14:48', '2018-10-13 19:14:48'),
(19, 10, 10, 'Exchange', 0, 20, '2018-10-14 01:56:58', '2018-10-14 01:56:58'),
(20, 10, 10, 'Exchange', 5, 10, '2018-10-14 01:57:02', '2018-10-14 01:57:02'),
(21, 10, 11, 'Exchange', 5, 20, '2018-10-14 01:58:48', '2018-10-14 01:58:48'),
(22, 11, 10, 'Exchange', 0, 15, '2018-10-14 01:58:52', '2018-10-14 01:58:52'),
(23, 11, 11, 'Exchange', 5, 20, '2018-10-14 02:04:01', '2018-10-14 02:04:01'),
(24, 11, 11, 'Exchange', 0, 10, '2018-10-14 02:04:06', '2018-10-14 02:04:06'),
(25, 10, 11, 'Exchange', 5, 20, '2018-10-14 03:06:13', '2018-10-14 03:06:13'),
(26, 11, 10, 'Exchange', 0, 10, '2018-10-14 03:06:18', '2018-10-14 03:06:18');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `PublicAddress` varchar(255) DEFAULT NULL,
  `PrivateKey` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `username`, `password`, `email`, `phone`, `userType`, `PublicAddress`, `PrivateKey`, `avatar`) VALUES
(8, 'takashop', '123123213213', NULL, NULL, 'Shop', '0x4068bF0b6Bf21E63f7F30D2218Fc1807a38FB518', '0xF54CD0EA34CD780CEE510BF4DB7DE53DCB83FA8AB49F12736ECCDA190DF85D55', '/image/1.png'),
(9, 'tun12', '123123213213', NULL, NULL, 'Shop', '0xdc6Ad0791e386000fF9dF8dE35716603bD4BC745', '0xBD2218BEE53EAD25BEE75ADB404CDDC5AD46F0059B07351F605DD49849B0F4ED', '/image/2.jpeg'),
(10, 'cat', '123123', 'cat-1@gmail.com', '0969-696-969', 'Customer', '0x32dA8eED08D6ae33167b9afb58fae1fCAE1eb1F2', '0xCB706FED304AD0B0CF8EB019415ED31BA803F8C1E253088DF5AAA56A1AAB96AF', '/image/Cat-icon.png'),
(11, 'dog', '123123', NULL, NULL, 'Customer', '0x086c1268DFea79eaa32DbA2271DeCF685049753D', '0xF548F89CBB264DAA8C1C80AA948AB1E808173CC0C9AF25A4C5207E81CDD45D58', NULL);

--
-- Triggers `User`
--
DELIMITER $$
CREATE TRIGGER `User_Insert` AFTER INSERT ON `User` FOR EACH ROW BEGIN
    	SET @a = NEW.userId;
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Voucher`
--

CREATE TABLE `Voucher` (
  `voucherId` int(11) NOT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `shopId` int(11) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'available',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Voucher`
--

INSERT INTO `Voucher` (`voucherId`, `ownerId`, `shopId`, `discount`, `code`, `status`, `createdAt`, `updatedAt`) VALUES
(8, 10, 8, 15, 'NXwk2sqTvFTIXac3oMLxdTjlMFVn5e', 'available', '2018-10-13 05:59:19', '2018-10-13 05:59:19'),
(9, 10, 8, 20, 'FBPdttmCkgBnmAglYMF0ywVfqnwOzk', 'available', '2018-10-13 17:59:59', '2018-10-13 17:59:59'),
(10, 10, 8, 20, 'MVpsCzKyQyujOb5MHWAQeT38aN3WG9', 'available', '2018-10-13 18:00:04', '2018-10-13 18:00:04'),
(11, 10, 8, 20, 'fvw6BZt9IH9ciWSSHyf4zOkedZyr2D', 'available', '2018-10-13 18:00:09', '2018-10-13 18:00:09');

-- --------------------------------------------------------

--
-- Table structure for table `Wallet`
--

CREATE TABLE `Wallet` (
  `ownerId` int(11) NOT NULL,
  `PointId` int(11) DEFAULT NULL,
  `ownerPublicAddress` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`customerId`),
  ADD KEY `customerId` (`customerId`);

--
-- Indexes for table `Exchange`
--
ALTER TABLE `Exchange`
  ADD PRIMARY KEY (`exchangeId`),
  ADD KEY `publisherId` (`publisherId`),
  ADD KEY `traderId` (`traderId`);

--
-- Indexes for table `Point`
--
ALTER TABLE `Point`
  ADD PRIMARY KEY (`PointID`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`productId`),
  ADD UNIQUE KEY `shopId` (`shopId`);

--
-- Indexes for table `Shop`
--
ALTER TABLE `Shop`
  ADD PRIMARY KEY (`shopId`),
  ADD UNIQUE KEY `PoinID` (`PointID`),
  ADD KEY `shopId` (`shopId`);

--
-- Indexes for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD PRIMARY KEY (`transactionId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `Voucher`
--
ALTER TABLE `Voucher`
  ADD PRIMARY KEY (`voucherId`);

--
-- Indexes for table `Wallet`
--
ALTER TABLE `Wallet`
  ADD PRIMARY KEY (`ownerId`),
  ADD UNIQUE KEY `PointId` (`PointId`),
  ADD UNIQUE KEY `ownerPublicAddress` (`ownerPublicAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Customer`
--
ALTER TABLE `Customer`
  MODIFY `customerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `Exchange`
--
ALTER TABLE `Exchange`
  MODIFY `exchangeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `Shop`
--
ALTER TABLE `Shop`
  MODIFY `shopId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `Transaction`
--
ALTER TABLE `Transaction`
  MODIFY `transactionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `Voucher`
--
ALTER TABLE `Voucher`
  MODIFY `voucherId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Customer`
--
ALTER TABLE `Customer`
  ADD CONSTRAINT `fk_Customer_User` FOREIGN KEY (`customerId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Exchange`
--
ALTER TABLE `Exchange`
  ADD CONSTRAINT `fk_publisher_user` FOREIGN KEY (`publisherId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trader_user` FOREIGN KEY (`traderId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Shop`
--
ALTER TABLE `Shop`
  ADD CONSTRAINT `fk_Shop_User` FOREIGN KEY (`shopId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
