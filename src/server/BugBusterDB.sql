-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 10, 2025 at 06:23 PM
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
-- Database: `BugBusterDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `organizer` varchar(200) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(30) NOT NULL,
  `imageUrl` varchar(200) NOT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `ticket_capacity` int(11) DEFAULT 0,
  `remaining_tickets` int(11) NOT NULL,
  `ticket_type` enum('free','paid') DEFAULT 'free',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `organizer`, `title`, `description`, `category`, `imageUrl`, `event_date`, `location`, `ticket_capacity`, `remaining_tickets`, `ticket_type`, `created_at`) VALUES
(1, 1, 'TheMusicLovers', 'Campus Concert', 'Live music night', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-11-20 19:00:00', 'Main Hall', 100, 0, 'free', '2025-10-02 01:03:28'),
(2, 1, 'TechyCodes', 'Tech Workshop', 'Hands-on session introducing basic AI concepts and coding', '', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop\r\n', '2025-09-12 14:00:00', 'Innovation Hub', 120, 0, 'free', '2025-10-02 03:10:03'),
(3, 1, 'YouOnlyLoveOnce', 'Spring Music Festival', 'Outdoor music festival with live bands and food trucks', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop\r\n', '2025-04-10 18:00:00', 'Central Park Field', 1000, 0, 'paid', '2025-10-02 03:10:03'),
(4, 1, '', 'AI Hackathon 2025', '24-hour hackathon on AI/ML challenges', '', '', '2025-11-15 09:00:00', 'Tech Center', 200, 0, 'free', '2025-10-02 03:10:03'),
(5, 2, '', 'Career Networking Night', 'Connect with recruiters, alumni, and peers for career opportunities', '', '', '2025-10-20 17:00:00', 'Conference Hall A', 250, 0, 'free', '2025-10-02 03:10:03'),
(6, 2, '', 'Science Expo', 'Exhibition of student and faculty research projects', '', '', '2025-11-02 11:00:00', 'Science Building Atrium', 400, 0, 'free', '2025-10-02 03:10:03'),
(7, 1, '', 'Community Volunteering Day', 'Join teams to volunteer across the local community', '', '', '2025-12-01 08:00:00', 'Multiple locations', 300, 0, 'free', '2025-10-02 03:10:03'),
(8, 2, '', 'Startup Pitch Demo', 'Showcase startup ideas to investors and mentors', '', '', '2025-12-15 13:00:00', 'Innovation Auditorium', 150, 0, 'paid', '2025-10-02 03:10:03');

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
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `user_id`, `status`, `checked_in`, `created_at`) VALUES
(1, 1, 2, 'claimed', 0, '2025-10-02 01:03:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','organizer','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Olivia Organizer', 'olivia@events.com', 'dummyhash', 'organizer', '2025-10-02 01:03:28'),
(2, 'Sam Student', 'sam@student.com', 'dummyhash', 'student', '2025-10-02 01:03:28');

-- --------------------------------------------------------

--
-- Table structure for table `userSavedEvents`
--

CREATE TABLE `userSavedEvents` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userSavedEvents`
--

INSERT INTO `userSavedEvents` (`id`, `student_id`, `event_id`) VALUES
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
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `userSavedEvents`
--
ALTER TABLE `userSavedEvents`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
