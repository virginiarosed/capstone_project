-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 09:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bondvoyage_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `company_name` varchar(100) NOT NULL DEFAULT 'Admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `password`, `profile_image`, `created_at`, `updated_at`, `company_name`) VALUES
(1, '4bstravelandtours@bondvoyage.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_1_1748116657.jpg', '2025-05-24 19:56:16', '2025-05-25 10:18:59', '4B\'s Travel and Tours');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender` enum('user','bot') NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `session_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatbot_messages`
--

INSERT INTO `chatbot_messages` (`id`, `user_id`, `message`, `sender`, `timestamp`, `session_id`, `created_at`) VALUES
(72, 1, 'Hey there, traveler! I\'m Navi — your adventure sidekick from 4B\'s Travel and Tours!<br>(Navi = Navigation... get it? 😄)<br><br>I\'m here to help you with:<ul><li>Info on 4B\'s Travel and Tours services</li><li>Travel tips, hacks, and must-knows</li><li>Answers to your wildest travel questions</li></ul><p>Ready to explore? Just ask away — I\'ve got the map, the facts, and maybe a few cheesy jokes too. 😎</p><p>Let\'s get your journey started!</p>', 'bot', '2025-05-30 03:27:26', 'session_1748546742713_tde1f6fso', '2025-05-29 19:27:26');

-- --------------------------------------------------------

--
-- Table structure for table `create_travel`
--

CREATE TABLE `create_travel` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `travel_name` varchar(255) NOT NULL,
  `share_code` varchar(8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `create_travel`
--

INSERT INTO `create_travel` (`id`, `user_id`, `travel_name`, `share_code`, `created_at`) VALUES
(1, 1, 'Baguio', 'EJUR98KB', '2025-05-25 09:42:22');

-- --------------------------------------------------------

--
-- Table structure for table `customized_intineraries`
--

CREATE TABLE `customized_intineraries` (
  `id` int(11) NOT NULL COMMENT 'Primary Key',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `client_name` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `lodging` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `travel_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customized_intineraries`
--

INSERT INTO `customized_intineraries` (`id`, `created_at`, `client_name`, `destination`, `lodging`, `start_date`, `end_date`, `travel_id`) VALUES
(1, '2025-05-25 09:42:51', 'Virginia Rose Dichoso', 'Baguio', 'Hotel', '2025-05-25 00:00:00', '2025-05-26 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `customized_intinerary_days`
--

CREATE TABLE `customized_intinerary_days` (
  `id` int(11) NOT NULL COMMENT 'Primary Key',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `customized_initerary_id` int(11) NOT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_number` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customized_intinerary_days`
--

INSERT INTO `customized_intinerary_days` (`id`, `created_at`, `customized_initerary_id`, `activity`, `start_time`, `end_time`, `day_number`, `date`) VALUES
(7, '2025-05-29 16:21:22', 1, 'a', '00:21:00', '00:22:00', 1, '2025-05-25 00:00:00'),
(8, '2025-05-29 16:21:22', 1, 'a', '00:21:00', '01:21:00', 2, '2025-05-26 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `feedback` text NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `feedback`, `submitted_at`) VALUES
(1, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Wow. Thanks!', '2025-01-13 18:12:15'),
(2, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Take 2', '2025-01-13 18:20:04'),
(3, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Take 3', '2025-01-13 18:20:58'),
(4, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Take 4', '2025-01-13 18:25:51'),
(5, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Take 5', '2025-01-13 18:31:55'),
(6, 'Virginia Rose Dichoso', 'virginiarosedichoso@gmail.com', 'Wow!', '2025-01-13 21:20:13');

-- --------------------------------------------------------

--
-- Table structure for table `itineraries`
--

CREATE TABLE `itineraries` (
  `id` int(11) NOT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `duration_nights` int(11) DEFAULT NULL,
  `lodging` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_days`
--

CREATE TABLE `itinerary_days` (
  `id` int(11) NOT NULL,
  `itinerary_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` int(11) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `place_name` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `activities` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `destination`, `place_name`, `location`, `description`, `activities`, `created_at`) VALUES
(1, 'Ilocos', 'San Agustin Church of Paoay', 'Marcos Ave, Paoay, Ilocos Norte', 'Paoay Church is a Roman Catholic church in Paoay, Ilocos Norte province, completed in 1710 after two decades of construction. With a massive pediment and complementary bell tower standing imposingly on an expansive plain, the church is famous for its architecture that blends baroque, gothic, Chinese, and Javanese styles. Today, it is one of the top tourist attractions in the Ilocos Region.', 'Religious Services (Masses, Novena Services, Sacrament of Confession)\r\nCultural and Heritage Tours\r\nEducational and Spiritual Workshops\r\nHeritage and Arts Exhibits\r\nLocal Craft and Souvenir Sales', '2025-01-13 22:39:23'),
(2, 'Baguio', 'Burnham Park', 'Jose Abad Santos Dr, Baguio, 2600 Benguet', 'Burnham Park, officially known as the Burnham Park Reservation, is a historic urban park located in downtown Baguio, Philippines.', 'Dog park\r\nPicnic tables available\r\nPlayground swings', '2025-01-14 09:51:15'),
(3, 'Vigan-Baguio', 'Calle Crisologo', 'Calle Crisologo', 'Calle Crisologo is Vigan’s most popular tourist attraction and is the highlight of a Vigan City tour. The grounds and pavements of this preserved street are made of cobblestones, and both sides are lined with ancestral houses that are reminiscent of old Spanish towns.', 'Souvenir shopping\r\nNative food products', '2025-01-14 09:55:57'),
(4, 'Bicol', 'Mayon Volcano', 'Bicol', 'Mayon, also known as Mount Mayon and Mayon Volcano is an active stratovolcano in the province of Albay in Bicol, Philippines. A popular tourist spot, it is renowned for its \"perfect cone\" because of its symmetric conical shape, and is regarded as sacred in Philippine mythology.', 'Sightseeing', '2025-01-14 09:59:06');

-- --------------------------------------------------------

--
-- Table structure for table `place_images`
--

CREATE TABLE `place_images` (
  `id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `place_images`
--

INSERT INTO `place_images` (`id`, `place_id`, `image_path`) VALUES
(1, 1, '../uploads/6785961c1c213_paoay-church-4.JPG'),
(2, 1, '../uploads/6785961c51d20_paoay-church-3.jpg'),
(3, 1, '../uploads/6785961cbdfec_paoay-church-2.png'),
(4, 1, '../uploads/6785961d74975_paoay-church-1.jpg'),
(5, 2, '../uploads/678633940ba74_Burnham-park3.jpg'),
(6, 2, '../uploads/67863395c832f_Burnham-park2.jpg'),
(7, 2, '../uploads/6786339611bab_Burnham-park1.jpg'),
(8, 2, '../uploads/67863397926b3_Burnham-park.jpg'),
(9, 3, '../uploads/678634ad680e9_calle crisologo.jpg'),
(10, 4, '../uploads/6786356a2a38f_Mayon.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `travel_collaborators`
--

CREATE TABLE `travel_collaborators` (
  `id` int(11) NOT NULL,
  `travel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `birthday` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `security_question_1` varchar(255) NOT NULL,
  `security_answer_1` varchar(255) NOT NULL,
  `security_question_2` varchar(255) NOT NULL,
  `security_answer_2` varchar(255) NOT NULL,
  `security_question_3` varchar(255) NOT NULL,
  `security_answer_3` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT 'profile.svg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `mobile`, `birthday`, `password`, `security_question_1`, `security_answer_1`, `security_question_2`, `security_answer_2`, `security_question_3`, `security_answer_3`, `created_at`, `profile_image`) VALUES
(1, 'Virginia Rose', 'Dichoso', 'virginiarosedichoso@gmail.com', '09064815090', '2003-01-04', '$2y$10$hbglgRDQ9GqpHtWBhj2U/O1osolsI3j8XiK1OODera7U/2jSRDz5e', 'friend', '$2y$10$Wo8A6kTQRBtReJtgCnQt2.Em1Letci6xb09c/dHZGxUc7Nw5m38jm', 'toy', '$2y$10$HB0nb2lMkQS9Dj5nqQZFF.Fp1RBaG3wnWAK9bJRtmLVjBxbnc25bi', 'character', '$2y$10$SwEfZU4eYy0JCdjCyJ.H/OU.OApe1ZSnhitV0.sAqkcGWDwPtGC0.', '2025-01-12 07:42:27', '1_6831ede3d16dc.jpg'),
(2, 'Tony', 'Stark', 'tonystark@gmail.com', '09064815090', '2003-01-04', '$2y$10$IHYZBwWx2HOuRCKyIwRgu..fCGHUNzdHITPkWprIYRfLYiFA38O66', 'movie', '$2y$10$egON3O5VMBmyyzSGhI3zy.DnfkZSeUayL.r01E6Brli2UFsF.vjNe', 'friend', '$2y$10$FbUxP92BSMWAJDj1M8OtjOyeJiqmaHdthLm8gXHsNpL2oKg6W4Wqy', 'character', '$2y$10$0KS8FjAj7M0/41khNkBCWe0LJnvr4S6jE.UHKdQ6x8458pKyct2Zq', '2025-01-12 08:56:33', 'profile.svg'),
(3, 'Steve', 'Rogers', 'steverogers@gmail.com', '09064815090', '2003-01-04', '$2y$10$dvF2Qqpny9Vp.EjTJQCwNuEkMzbNn2g5REFafBsJBxd9MROz.4Ryy', 'movie', '$2y$10$bX1oxk//b6hgM6umL03bneJ46yVjqaZUS/X12l7KJ95KdlNzRGpcG', 'friend', '$2y$10$Wi.ojVHXJ5nwwTdBif1h8OKSHnv.edvju5tav3suv3mTBMH0ypCwu', 'character', '$2y$10$v/xt1pxxcuGVrPW/E.XuIehruVD8EjolNInHAKjZq/frQG/WX7QLu', '2025-01-12 19:18:33', 'profile.svg'),
(5, 'Ayumi', 'Hidalgo', 'ayumihidalgo@gmail.com', '09946311236', '2009-12-27', '$2y$10$GTCsfBnLabLnDcgL3xxhLOEotFRBf.t9vrbH74a/uDh6Wk2wLYeda', 'movie', '$2y$10$1s/eXaAN.3v0nCXOMN8kje46pDzmJybIls9sptn23LWxl8Auw0OI.', 'friend', '$2y$10$RxTBB5cYyUXXfbMuyf/k..lzn/gpmFJ5tJHQssUEKNYFhYvYW85dO', 'purchase', '$2y$10$dLGVBoOwUtk834f8bytTJOshqZUotIKlfJttfQZmXoNfjpI49x54y', '2025-01-16 06:42:33', 'profile.svg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `timestamp` (`timestamp`),
  ADD KEY `idx_user_timestamp` (`user_id`,`timestamp`);

--
-- Indexes for table `create_travel`
--
ALTER TABLE `create_travel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `share_code` (`share_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customized_intineraries`
--
ALTER TABLE `customized_intineraries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customized_intinerary_days`
--
ALTER TABLE `customized_intinerary_days`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itinerary_id` (`itinerary_id`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `place_images`
--
ALTER TABLE `place_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `place_id` (`place_id`);

--
-- Indexes for table `travel_collaborators`
--
ALTER TABLE `travel_collaborators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `travel_id` (`travel_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `create_travel`
--
ALTER TABLE `create_travel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customized_intineraries`
--
ALTER TABLE `customized_intineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customized_intinerary_days`
--
ALTER TABLE `customized_intinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key', AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `place_images`
--
ALTER TABLE `place_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `travel_collaborators`
--
ALTER TABLE `travel_collaborators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `create_travel`
--
ALTER TABLE `create_travel`
  ADD CONSTRAINT `create_travel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `place_images`
--
ALTER TABLE `place_images`
  ADD CONSTRAINT `place_images_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `travel_collaborators`
--
ALTER TABLE `travel_collaborators`
  ADD CONSTRAINT `travel_collaborators_ibfk_1` FOREIGN KEY (`travel_id`) REFERENCES `create_travel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `travel_collaborators_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
