-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 05:56 AM
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

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `category`, `imageUrl`, `event_date`, `location`, `ticket_capacity`, `remaining_tickets`, `ticket_type`, `status`, `created_at`) VALUES
(1, 1, 'Campus Concert', 'Live music night', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-11-20 19:00:00', 'Main Hall', 100, 0, 'free', 'PUBLISHED', '2025-10-02 01:03:28'),
(2, 1, 'Tech Workshop', 'Hands-on session introducing basic AI concepts and coding', '', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop\r\n', '2025-09-12 14:00:00', 'Innovation Hub', 120, 0, 'free', 'PUBLISHED', '2025-10-02 03:10:03'),
(3, 1, 'Spring Music Festival', 'Outdoor music festival with live bands and food trucks', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop\n', '2025-04-10 18:00:00', 'Central Park Field', 1000, 0, 'paid', 'PUBLISHED', '2025-10-02 03:10:03'),
(4, 1, 'AI Hackathon 2025', '24-hour hackathon on AI/ML challenges', '', '', '2025-11-15 09:00:00', 'Tech Center', 200, 0, 'free', 'PUBLISHED', '2025-10-02 03:10:03'),
(7, 1, 'Community Volunteering Day', 'Join teams to volunteer across the local community', '', '', '2025-12-01 08:00:00', 'Multiple locations', 300, 0, 'free', 'PUBLISHED', '2025-10-02 03:10:03'),
(8, 2, 'Startup Pitch Demo', 'Showcase startup ideas to investors and mentors', '', '', '2025-12-15 13:00:00', 'Innovation Auditorium', 150, 0, 'paid', 'PUBLISHED', '2025-10-02 03:10:03'),
(9, 1, 't', 't', 'Technology', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-30 22:19:00', 'ttt', 4, 4, 'paid', 'PUBLISHED', '2025-10-11 15:39:53'),
(10, 1, 'title', 'Describe', 'Music', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-01 18:37:00', 'tt', 100, 100, 'free', 'PUBLISHED', '2025-10-11 18:42:11'),
(11, 1, 'Concert', 'Description', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 15:24:00', 'Montreal', 10, 10, 'free', 'PUBLISHED', '2025-10-11 19:24:59'),
(13, 3, 'ti', 't', 'Academic', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-25 03:28:00', 'Montreal', 100, 100, 'free', 'PUBLISHED', '2025-10-12 19:28:42'),
(14, 3, 'hey', 'tt', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-24 17:12:00', 'Montreal', 100, 100, 'free', 'PUBLISHED', '2025-10-12 21:12:20'),
(16, 3, 're', '100', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 17:12:00', 'Montreal', 1000, 1000, 'free', 'PUBLISHED', '2025-10-12 21:12:45'),
(17, 8, 'Tech Conference 2025', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Technology', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-15 09:00:00', 'Convention Center, Montreal', 500, 234, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(18, 9, 'Music Festival', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-20 18:00:00', 'Parc Jean-Drapeau, Montreal', 2000, 1500, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(19, 10, 'Study Group - Calculus', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Academic', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop', '2025-10-12 14:00:00', 'Library Room 301', 20, 12, 'free', 'PUBLISHED', '2025-11-15 01:39:34'),
(20, 11, 'Basketball Tournament', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Sports', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop', '2025-10-18 10:00:00', 'Gymnasium', 64, 45, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(21, 12, 'Art Exhibition Opening', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Arts', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop', '2025-10-14 17:00:00', 'Art Gallery', 100, 67, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(22, 13, 'Career Fair', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Career', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop', '2025-10-25 10:00:00', 'Student Center', 300, 180, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(23, 14, 'Environmental Workshop', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Environment', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop', '2025-10-16 13:00:00', 'Environmental Science Building', 50, 23, 'free', 'PUBLISHED', '2025-11-15 01:39:34'),
(24, 15, 'Dance Workshop', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Arts', 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=200&fit=crop', '2025-10-22 19:00:00', 'Dance Studio', 30, 18, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(25, 882, 'Campus Concert', 'Live music night', 'Music', 'https://example.com/img1.jpg', '2025-11-14 20:39:34', 'Main Hall', 100, 50, 'free', 'PUBLISHED', '2025-11-15 01:39:34'),
(26, 882, 'Tech Talk', 'JS & Node deep dive', 'Tech', 'https://example.com/img2.jpg', '2025-11-15 20:39:34', 'Auditorium', 80, 80, 'free', 'PUBLISHED', '2025-11-15 01:39:34'),
(27, 883, 'Art Expo', 'Student art exhibition', 'Art', 'https://example.com/img3.jpg', '2025-11-16 20:39:34', 'Gallery', 120, 120, 'paid', 'PUBLISHED', '2025-11-15 01:39:34'),
(28, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 101, 'free', 'PUBLISHED', '2025-11-15 02:09:02'),
(29, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-15 02:16:15'),
(30, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-15 02:17:19'),
(31, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-15 02:17:43'),
(32, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-15 02:21:27'),
(33, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-18 01:27:15'),
(34, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-18 04:03:44'),
(35, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-18 04:29:44'),
(36, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-19 02:01:20'),
(37, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-19 02:02:02'),
(38, 885, 'Welcome Fair', 'Campus welcome fair with booths and games', 'Campus', 'https://picsum.photos/seed/event38/400/200', '2025-09-10 10:00:00', 'Main Quad', 200, 40, 'free', 'PUBLISHED', '2025-08-20 13:00:00'),
(39, 885, 'Intro to AI Talk', 'Keynote on AI trends for students', 'Academic', 'https://picsum.photos/seed/event39/400/200', '2025-09-25 18:00:00', 'Auditorium A', 150, 30, 'free', 'PUBLISHED', '2025-09-01 18:00:00'),
(40, 885, 'Startup Mixer', 'Networking event for student founders', 'Networking', 'https://picsum.photos/seed/event40/400/200', '2025-10-02 19:00:00', 'Innovation Hub', 100, 20, 'paid', 'PUBLISHED', '2025-09-10 14:30:00'),
(41, 885, 'Design Hack Night', 'Overnight design sprint on UX challenges', 'Technology', 'https://picsum.photos/seed/event41/400/200', '2025-10-10 20:00:00', 'Lab 3', 80, 10, 'free', 'PUBLISHED', '2025-09-15 16:00:00'),
(42, 885, 'Music on the Lawn', 'Outdoor acoustic music evening', 'Music', 'https://picsum.photos/seed/event42/400/200', '2025-10-18 17:30:00', 'South Lawn', 300, 120, 'free', 'PUBLISHED', '2025-09-20 19:00:00'),
(43, 885, 'Career Fair', 'Meet employers from multiple industries', 'Career', 'https://picsum.photos/seed/event43/400/200', '2025-10-25 10:00:00', 'Main Hall', 400, 50, 'free', 'PUBLISHED', '2025-09-25 15:30:00'),
(44, 885, 'Data Science Bootcamp', 'Weekend intensive on data science basics', 'Academic', 'https://picsum.photos/seed/event44/400/200', '2025-11-03 09:00:00', 'Room 210', 120, 40, 'paid', 'PUBLISHED', '2025-10-05 13:00:00'),
(45, 885, 'Game Jam', '48-hour game creation marathon', 'Technology', 'https://picsum.photos/seed/event45/400/200', '2025-11-07 18:00:00', 'Tech Center', 200, 80, 'free', 'PUBLISHED', '2025-10-10 14:00:00'),
(46, 885, 'Film Night', 'Screening of classic and indie films', 'Culture', 'https://picsum.photos/seed/event46/400/200', '2025-11-12 20:00:00', 'Cinema Room', 150, 75, 'free', 'PUBLISHED', '2025-10-12 16:00:00'),
(47, 885, 'Alumni Panel', 'Panel with recent graduates sharing experiences', 'Career', 'https://picsum.photos/seed/event47/400/200', '2025-11-18 17:00:00', 'Conference Room B', 100, 25, 'free', 'PUBLISHED', '2025-10-15 19:00:00'),
(48, 885, 'Robotics Demo Day', 'Showcase of student robotics projects', 'Technology', 'https://picsum.photos/seed/event48/400/200', '2025-11-21 14:00:00', 'Engineering Lab', 180, 60, 'free', 'PUBLISHED', '2025-10-18 20:30:00'),
(49, 885, 'Holiday Concert', 'End-of-term holiday music performance', 'Music', 'https://picsum.photos/seed/event49/400/200', '2025-12-05 19:30:00', 'Auditorium B', 250, 150, 'paid', 'PUBLISHED', '2025-11-01 14:00:00'),
(50, 885, 'Winter Hackathon', 'Coding competition focused on sustainability', 'Technology', 'https://picsum.photos/seed/event50/400/200', '2025-12-10 09:00:00', 'Tech Center', 220, 90, 'free', 'PUBLISHED', '2025-11-02 16:00:00'),
(51, 885, 'Art Exhibition', 'Student art gallery opening night', 'Culture', 'https://picsum.photos/seed/event51/400/200', '2025-12-15 18:00:00', 'Gallery', 180, 80, 'free', 'PUBLISHED', '2025-11-03 18:00:00'),
(52, 885, 'Exam Prep Workshop', 'Study strategies and Q&A with tutors', 'Academic', 'https://picsum.photos/seed/event52/400/200', '2025-11-25 16:00:00', 'Room 101', 90, 10, 'free', 'PUBLISHED', '2025-10-20 13:00:00'),
(53, 885, 'Entrepreneurship 101', 'Intro talk on starting your own venture', 'Career', 'https://picsum.photos/seed/event53/400/200', '2025-11-28 18:30:00', 'Innovation Hub', 130, 30, 'paid', 'PUBLISHED', '2025-10-22 18:00:00'),
(54, 885, 'Language Exchange Night', 'Practice languages with fellow students', 'Culture', 'https://picsum.photos/seed/event54/400/200', '2025-11-30 19:00:00', 'Café Lounge', 100, 50, 'free', 'PUBLISHED', '2025-10-25 20:00:00'),
(55, 885, 'Coding for Beginners', 'Intro workshop on basic programming', 'Academic', 'https://picsum.photos/seed/event55/400/200', '2025-10-28 17:00:00', 'Lab 1', 80, 20, 'free', 'PUBLISHED', '2025-09-30 13:30:00'),
(56, 885, 'Wellness Day', 'Mindfulness and stress relief activities', 'Wellness', 'https://picsum.photos/seed/event56/400/200', '2025-11-08 10:00:00', 'Student Center', 200, 100, 'free', 'PUBLISHED', '2025-10-08 14:00:00'),
(57, 885, 'Board Game Social', 'Casual night of board and card games', 'Social', 'https://picsum.photos/seed/event57/400/200', '2025-11-14 19:00:00', 'Café Lounge', 120, 40, 'free', 'PUBLISHED', '2025-10-11 22:00:00'),
(58, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:42:29'),
(59, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:47:56'),
(60, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:48:23'),
(61, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:48:49'),
(62, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:50:19'),
(63, 881, 'Mock Event', 'For testing', 'Music', 'mock.png', '2025-12-01 18:00:00', 'Test Hall', 100, 100, 'free', 'PUBLISHED', '2025-11-24 01:55:40');

-- --------------------------------------------------------

--
-- Table structure for table `organizer_subscriptions`
--

CREATE TABLE `organizer_subscriptions` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizer_subscriptions`
--

INSERT INTO `organizer_subscriptions` (`id`, `organizer_id`, `user_id`, `created_at`) VALUES
(70, 885, 1, '2025-11-19 01:36:21'),
(103, 885, 16, '2025-09-10 14:00:00'),
(104, 885, 17, '2025-09-11 15:00:00'),
(105, 885, 18, '2025-09-12 16:00:00'),
(106, 885, 19, '2025-09-13 17:00:00'),
(107, 885, 20, '2025-09-14 18:00:00'),
(108, 885, 21, '2025-09-15 19:00:00'),
(109, 885, 22, '2025-09-16 20:00:00'),
(110, 885, 23, '2025-09-17 21:00:00'),
(111, 885, 24, '2025-09-18 22:00:00'),
(112, 885, 25, '2025-09-19 23:00:00'),
(113, 885, 26, '2025-10-01 13:00:00'),
(114, 885, 27, '2025-10-02 14:00:00'),
(115, 885, 28, '2025-10-03 15:00:00'),
(116, 885, 29, '2025-10-04 16:00:00'),
(117, 885, 30, '2025-10-05 17:00:00'),
(118, 885, 31, '2025-10-06 18:00:00'),
(119, 885, 32, '2025-10-07 19:00:00'),
(120, 885, 33, '2025-10-08 20:00:00'),
(121, 885, 34, '2025-10-09 21:00:00'),
(122, 885, 35, '2025-10-10 22:00:00'),
(123, 885, 36, '2025-10-11 13:30:00'),
(124, 885, 37, '2025-10-12 14:30:00'),
(125, 885, 38, '2025-10-13 15:30:00'),
(126, 885, 39, '2025-10-14 16:30:00'),
(127, 885, 40, '2025-10-15 17:30:00'),
(128, 885, 41, '2025-10-16 18:30:00'),
(129, 885, 42, '2025-10-17 19:30:00'),
(130, 885, 43, '2025-10-18 20:30:00'),
(131, 885, 44, '2025-10-19 21:30:00'),
(132, 885, 45, '2025-10-20 22:30:00'),
(133, 885, 46, '2025-11-01 13:00:00'),
(134, 885, 47, '2025-11-02 15:00:00'),
(135, 885, 48, '2025-11-03 16:00:00'),
(136, 885, 49, '2025-11-04 17:00:00'),
(137, 885, 50, '2025-11-05 18:00:00'),
(138, 885, 51, '2025-11-06 19:00:00'),
(139, 885, 52, '2025-11-07 20:00:00'),
(140, 885, 53, '2025-11-08 21:00:00'),
(141, 885, 54, '2025-11-09 22:00:00'),
(142, 885, 55, '2025-11-10 23:00:00'),
(143, 885, 56, '2025-11-11 14:15:00'),
(144, 885, 57, '2025-11-12 15:15:00'),
(145, 885, 58, '2025-11-13 16:15:00'),
(146, 885, 59, '2025-11-14 17:15:00'),
(147, 885, 60, '2025-11-15 18:15:00'),
(148, 885, 61, '2025-11-16 19:15:00'),
(149, 885, 62, '2025-11-17 20:15:00'),
(150, 885, 63, '2025-11-18 21:15:00'),
(151, 885, 64, '2025-11-19 22:15:00'),
(152, 885, 65, '2025-11-20 23:15:00'),
(282, 1, 885, '2025-11-24 21:17:56');

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
  `qr_payload` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `user_id`, `status`, `checked_in`, `qr_code`, `qr_payload`, `created_at`) VALUES
(1, 1, 2, 'claimed', 0, NULL, NULL, '2025-10-02 01:03:28'),
(5, 13, 5, 'claimed', 0, NULL, NULL, '2025-10-12 21:06:05'),
(6, 13, 6, 'claimed', 1, NULL, NULL, '2025-10-12 21:06:05'),
(7, 13, 7, 'waitlisted', 0, NULL, NULL, '2025-10-12 21:06:05'),
(8, 1, 1, 'waitlisted', 0, NULL, NULL, '2025-11-15 02:09:00'),
(11, 28, 885, 'claimed', 0, NULL, NULL, '2025-11-25 04:39:45'),
(12, 30, 885, 'claimed', 0, NULL, NULL, '2025-11-25 04:52:10'),
(14, 31, 885, 'claimed', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOZSURBVO3BQY4cSQIDQWeg/v9l3znMgacAElktabQ0i/9g5l+HmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZ8uGlJPxKKjdJeEOlJeEJlZaEX0nljcNMOcyUw0z58GUq35SEN1RaEn4nlW9KwjcdZsphphxmyocfloQnVJ5IQlNpSXhD5SYJbyThCZWfdJgph5lymCkf/jJJeEKlJaGp3Kj8TQ4z5TBTDjPlw19G5SYJLQlNpSXhCZX/ssNMOcyUw0z58MNUfqckvKHSkvBNKn+Sw0w5zJTDTPnwZUn4k6m0JNwkoam0JDyRhD/ZYaYcZsphpnx4SeVPkoSm0pLwTSo3Kv8lh5lymCmHmRL/wQtJaCotCd+kcpOEG5WbJLyh0pLwTSo/6TBTDjPlMFM+fFkSmspNEm5UWhKaSlN5IglPqLQkvKHSkvA7HWbKYaYcZkr8By8k4QmVmyQ8odKS8ITKE0l4QqUl4UalJeEJlTcOM+UwUw4z5cNLKi0JTeUJlZskvKHSktBUnlBpSWhJaCpPqNwk4ZsOM+UwUw4z5cMPS0JTaUloKi0JTeVG5SYJTeUmCd+UhKbSktBUblS+6TBTDjPlMFM+vJSEG5UblZaEptKS0FRaEm5UWhJuVFoSWhKaSkvCG0loKi0JTeWNw0w5zJTDTPnwZSo3SXgiCU+oPKHSkvCESkvCjcobSfhJh5lymCmHmfLhhyWhqbQkNJWbJDyRhKbSktBUblSeUGlJuFG5SUJT+abDTDnMlMNM+fDDVG5UbpLQVFoSmsobSbhRaUm4ScITSXgiCU3ljcNMOcyUw0z58JLKT1J5Q+VG5SYJT6g8kYSmcpOEpvJNh5lymCmHmfLhpST8SipNpSXhT5KEpvJEEppKS0JTeeMwUw4z5TBTPnyZyjcl4SYJNyotCU3lJglvqLyhcqPyTYeZcpgph5ny4Ycl4QmVP4lKS8JNEt5IQlNpSbhReeMwUw4z5TBTPvxlVFoSmkpLwo1KU7lJwo3KE0n4lQ4z5TBTDjPlw/85lZaEloSmcqNyk4Sm0pLQVG6S8E2HmXKYKYeZ8uGHqfwklZaEJ5Jwo9KScKPSktBUblR+p8NMOcyUw0z58GVJ+JWScKPyhEpLQlO5SUJTaUloKk8k4ScdZsphphxmSvwHM/86zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlP8BddmXF34pyQsAAAAASUVORK5CYII=', '7HkJgLTLSMGcezAsOT1xJw', '2025-11-25 04:55:59');

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
(7, 'Mark Chen', 'mark@example.com', 'dummyhash', 'student', '2025-10-12 21:04:35', NULL),
(8, 'Tech Society', 'tech-society@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(9, 'Music Club', 'music-club@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(10, 'Math Society', 'math-society@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(11, 'Athletics Department', 'athletics-dept@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(12, 'Fine Arts Club', 'fine-arts-club@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(13, 'Career Services', 'career-services@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(14, 'Green Club', 'green-club@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(15, 'Dance Society', 'dance-society@events.local', '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86', 'organizer', '2025-11-15 01:39:34', NULL),
(16, 'Student 01', 'student01@example.com', 'dummyhash', 'student', '2025-09-05 14:00:00', NULL),
(17, 'Student 02', 'student02@example.com', 'dummyhash', 'student', '2025-09-06 15:00:00', NULL),
(18, 'Student 03', 'student03@example.com', 'dummyhash', 'student', '2025-09-07 16:00:00', NULL),
(19, 'Student 04', 'student04@example.com', 'dummyhash', 'student', '2025-09-08 17:00:00', NULL),
(20, 'Student 05', 'student05@example.com', 'dummyhash', 'student', '2025-09-09 18:00:00', NULL),
(21, 'Student 06', 'student06@example.com', 'dummyhash', 'student', '2025-09-10 19:00:00', NULL),
(22, 'Student 07', 'student07@example.com', 'dummyhash', 'student', '2025-09-11 20:00:00', NULL),
(23, 'Student 08', 'student08@example.com', 'dummyhash', 'student', '2025-09-12 21:00:00', NULL),
(24, 'Student 09', 'student09@example.com', 'dummyhash', 'student', '2025-09-13 22:00:00', NULL),
(25, 'Student 10', 'student10@example.com', 'dummyhash', 'student', '2025-09-14 23:00:00', NULL),
(26, 'Student 11', 'student11@example.com', 'dummyhash', 'student', '2025-10-01 13:00:00', NULL),
(27, 'Student 12', 'student12@example.com', 'dummyhash', 'student', '2025-10-02 14:00:00', NULL),
(28, 'Student 13', 'student13@example.com', 'dummyhash', 'student', '2025-10-03 15:00:00', NULL),
(29, 'Student 14', 'student14@example.com', 'dummyhash', 'student', '2025-10-04 16:00:00', NULL),
(30, 'Student 15', 'student15@example.com', 'dummyhash', 'student', '2025-10-05 17:00:00', NULL),
(31, 'Student 16', 'student16@example.com', 'dummyhash', 'student', '2025-10-06 18:00:00', NULL),
(32, 'Student 17', 'student17@example.com', 'dummyhash', 'student', '2025-10-07 19:00:00', NULL),
(33, 'Student 18', 'student18@example.com', 'dummyhash', 'student', '2025-10-08 20:00:00', NULL),
(34, 'Student 19', 'student19@example.com', 'dummyhash', 'student', '2025-10-09 21:00:00', NULL),
(35, 'Student 20', 'student20@example.com', 'dummyhash', 'student', '2025-10-10 22:00:00', NULL),
(36, 'Student 21', 'student21@example.com', 'dummyhash', 'student', '2025-10-11 13:30:00', NULL),
(37, 'Student 22', 'student22@example.com', 'dummyhash', 'student', '2025-10-12 14:30:00', NULL),
(38, 'Student 23', 'student23@example.com', 'dummyhash', 'student', '2025-10-13 15:30:00', NULL),
(39, 'Student 24', 'student24@example.com', 'dummyhash', 'student', '2025-10-14 16:30:00', NULL),
(40, 'Student 25', 'student25@example.com', 'dummyhash', 'student', '2025-10-15 17:30:00', NULL),
(41, 'Student 26', 'student26@example.com', 'dummyhash', 'student', '2025-10-16 18:30:00', NULL),
(42, 'Student 27', 'student27@example.com', 'dummyhash', 'student', '2025-10-17 19:30:00', NULL),
(43, 'Student 28', 'student28@example.com', 'dummyhash', 'student', '2025-10-18 20:30:00', NULL),
(44, 'Student 29', 'student29@example.com', 'dummyhash', 'student', '2025-10-19 21:30:00', NULL),
(45, 'Student 30', 'student30@example.com', 'dummyhash', 'student', '2025-10-20 22:30:00', NULL),
(46, 'Student 31', 'student31@example.com', 'dummyhash', 'student', '2025-11-01 13:00:00', NULL),
(47, 'Student 32', 'student32@example.com', 'dummyhash', 'student', '2025-11-02 15:00:00', NULL),
(48, 'Student 33', 'student33@example.com', 'dummyhash', 'student', '2025-11-03 16:00:00', NULL),
(49, 'Student 34', 'student34@example.com', 'dummyhash', 'student', '2025-11-04 17:00:00', NULL),
(50, 'Student 35', 'student35@example.com', 'dummyhash', 'student', '2025-11-05 18:00:00', NULL),
(51, 'Student 36', 'student36@example.com', 'dummyhash', 'student', '2025-11-06 19:00:00', NULL),
(52, 'Student 37', 'student37@example.com', 'dummyhash', 'student', '2025-11-07 20:00:00', NULL),
(53, 'Student 38', 'student38@example.com', 'dummyhash', 'student', '2025-11-08 21:00:00', NULL),
(54, 'Student 39', 'student39@example.com', 'dummyhash', 'student', '2025-11-09 22:00:00', NULL),
(55, 'Student 40', 'student40@example.com', 'dummyhash', 'student', '2025-11-10 23:00:00', NULL),
(56, 'Student 41', 'student41@example.com', 'dummyhash', 'student', '2025-11-11 14:15:00', NULL),
(57, 'Student 42', 'student42@example.com', 'dummyhash', 'student', '2025-11-12 15:15:00', NULL),
(58, 'Student 43', 'student43@example.com', 'dummyhash', 'student', '2025-11-13 16:15:00', NULL),
(59, 'Student 44', 'student44@example.com', 'dummyhash', 'student', '2025-11-14 17:15:00', NULL),
(60, 'Student 45', 'student45@example.com', 'dummyhash', 'student', '2025-11-15 18:15:00', NULL),
(61, 'Student 46', 'student46@example.com', 'dummyhash', 'student', '2025-11-16 19:15:00', NULL),
(62, 'Student 47', 'student47@example.com', 'dummyhash', 'student', '2025-11-17 20:15:00', NULL),
(63, 'Student 48', 'student48@example.com', 'dummyhash', 'student', '2025-11-18 21:15:00', NULL),
(64, 'Student 49', 'student49@example.com', 'dummyhash', 'student', '2025-11-19 22:15:00', NULL),
(65, 'Student 50', 'student50@example.com', 'dummyhash', 'student', '2025-11-20 23:15:00', NULL),
(881, 'Test Student', 'student@example.com', 'clerk_managed_account', 'student', '2025-11-15 01:39:34', 'test-user'),
(882, 'Organizer One', 'org1@example.com', 'clerk_managed_account', 'organizer', '2025-11-15 01:39:34', NULL),
(883, 'Organizer Two', 'org2@example.com', 'clerk_managed_account', 'organizer', '2025-11-15 01:39:34', NULL),
(884, 'Another Student', 'student2@example.com', 'clerk_managed_account', 'student', '2025-11-15 01:39:34', NULL),
(885, 'Spencer Toupin', 'spencer.toupin@outlook.com', 'clerk_managed_account', 'student', '2025-11-18 01:33:13', 'user_357r1W98v2naNkxYRbRGYpEU0tA');

-- --------------------------------------------------------

--
-- Table structure for table `usersavedevents`
--

CREATE TABLE `usersavedevents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usersavedevents`
--

INSERT INTO `usersavedevents` (`id`, `user_id`, `event_id`) VALUES
(1, 2, 1),
(2, 1, 1),
(3, 1, 1),
(4, 1, 1),
(5, 1, 1),
(6, 1, 1),
(7, 1, 1),
(8, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1),
(13, 1, 1),
(14, 1, 1),
(15, 1, 1),
(16, 1, 1),
(17, 1, 1),
(20, 885, 7),
(22, 885, 4),
(24, 885, 29),
(25, 885, 8);

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
-- Indexes for table `organizer_subscriptions`
--
ALTER TABLE `organizer_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_organizer_user` (`organizer_id`,`user_id`),
  ADD KEY `fk_os_user` (`user_id`);

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
-- Indexes for table `usersavedevents`
--
ALTER TABLE `usersavedevents`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `organizer_subscriptions`
--
ALTER TABLE `organizer_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=283;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=886;

--
-- AUTO_INCREMENT for table `usersavedevents`
--
ALTER TABLE `usersavedevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
-- Constraints for table `organizer_subscriptions`
--
ALTER TABLE `organizer_subscriptions`
  ADD CONSTRAINT `fk_os_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_os_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `usersavedevents`
--
ALTER TABLE `usersavedevents`
  ADD CONSTRAINT `fk_userSavedEvents_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userSavedEvents_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
