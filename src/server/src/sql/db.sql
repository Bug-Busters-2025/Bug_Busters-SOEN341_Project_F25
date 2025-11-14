-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 12, 2025 at 11:40 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bugbusters`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(30) NOT NULL,
  `imageUrl` varchar(200) NOT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `ticket_capacity` int(11) DEFAULT 0,
  `remaining_tickets` int(11) NOT NULL,
  `ticket_type` enum('free','paid') DEFAULT 'free',
  `status` enum('PUBLISHED','DELETED') DEFAULT 'PUBLISHED',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `category`, `imageUrl`, `event_date`, `location`, `ticket_capacity`, `remaining_tickets`, `ticket_type`, `created_at`) VALUES
(1, 1, 'Campus Concert', 'Live music night', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-11-20 19:00:00', 'Main Hall', 100, 0, 'free', '2025-10-02 01:03:28'),
(2, 1, 'Tech Workshop', 'Hands-on session introducing basic AI concepts and coding', '', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop\r\n', '2025-09-12 14:00:00', 'Innovation Hub', 120, 0, 'free', '2025-10-02 03:10:03'),
(3, 1, 'Spring Music Festival', 'Outdoor music festival with live bands and food trucks', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop\n', '2025-04-10 18:00:00', 'Central Park Field', 1000, 0, 'paid', '2025-10-02 03:10:03'),
(4, 1, 'AI Hackathon 2025', '24-hour hackathon on AI/ML challenges', '', '', '2025-11-15 09:00:00', 'Tech Center', 200, 0, 'free', '2025-10-02 03:10:03'),
(7, 1, 'Community Volunteering Day', 'Join teams to volunteer across the local community', '', '', '2025-12-01 08:00:00', 'Multiple locations', 300, 0, 'free', '2025-10-02 03:10:03'),
(8, 2, 'Startup Pitch Demo', 'Showcase startup ideas to investors and mentors', '', '', '2025-12-15 13:00:00', 'Innovation Auditorium', 150, 0, 'paid', '2025-10-02 03:10:03'),
(9, 1, 't', 't', 'Technology', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-30 22:19:00', 'ttt', 4, 4, 'paid', '2025-10-11 15:39:53'),
(10, 1, 'title', 'Describe', 'Music', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-01 18:37:00', 'tt', 100, 100, 'free', '2025-10-11 18:42:11'),
(11, 1, 'Concert', 'Description', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 15:24:00', 'Montreal', 10, 10, 'free', '2025-10-11 19:24:59'),
(13, 3, 'ti', 't', 'Academic', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-25 03:28:00', 'Montreal', 100, 100, 'free', '2025-10-12 19:28:42'),
(14, 3, 'hey', 'tt', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-24 17:12:00', 'Montreal', 100, 100, 'free', '2025-10-12 21:12:20'),
(16, 3, 're', '100', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 17:12:00', 'Montreal', 1000, 1000, 'free', '2025-10-12 21:12:45');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('claimed','waitlisted') NOT NULL DEFAULT 'claimed',
  `checked_in` tinyint(1) NOT NULL DEFAULT 0,
  `qr_code` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `user_id`, `status`, `checked_in`, `created_at`) VALUES
(1, 1, 2, 'claimed', 0, '2025-10-02 01:03:28'),
(5, 13, 5, 'claimed', 0, '2025-10-12 21:06:05'),
(6, 13, 6, 'claimed', 1, '2025-10-12 21:06:05'),
(7, 13, 7, 'waitlisted', 0, '2025-10-12 21:06:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) DEFAULT 'clerk_managed_account',
  `role` enum('student','organizer','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `clerk_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `clerk_id`) VALUES
(1, 'Olivia Organizer', 'olivia@events.com', 'dummyhash', 'organizer', '2025-10-02 01:03:28', NULL),
(2, 'Sam Student', 'sam@student.com', 'dummyhash', 'student', '2025-10-02 01:03:28', NULL),
(3, 'Liam Handfield', 'liamhandfield@gmail.com', 'clerk_managed_account', 'organizer', '2025-10-12 13:31:32', 'user_33x0IiCGcDIQ0DaFeD0UZVmRGs8'),
(5, 'John Doe', 'john@example.com', 'dummyhash', 'student', '2025-10-12 21:04:35', NULL),
(6, 'Jane Smith', 'jane@example.com', 'dummyhash', 'student', '2025-10-12 21:04:35', NULL),
(7, 'Mark Chen', 'mark@example.com', 'dummyhash', 'student', '2025-10-12 21:04:35', NULL);

-- --------------------------------------------------------
--
-- Table structure for table `organizer_subscriptions`
--

CREATE TABLE organizer_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_organizer_user (organizer_id, user_id),

  CONSTRAINT fk_os_organizer
    FOREIGN KEY (organizer_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_os_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

--
-- Dumping data for table `userSavedEvents`
--



-- --------------------------------------------------------

--
-- Table structure for table `userSavedEvents`
--

CREATE TABLE `userSavedEvents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userSavedEvents`
--

INSERT INTO `userSavedEvents` (`id`, `user_id`, `event_id`) VALUES
(1, 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `clerk_id` (`clerk_id`);

--
-- Indexes for table `userSavedEvents`
--
ALTER TABLE `userSavedEvents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userSavedEvents_user` (`user_id`),
  ADD KEY `fk_userSavedEvents_event` (`event_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `userSavedEvents`
--
ALTER TABLE `userSavedEvents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_events_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `userSavedEvents`
--
ALTER TABLE `userSavedEvents`
  ADD CONSTRAINT `fk_userSavedEvents_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userSavedEvents_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
