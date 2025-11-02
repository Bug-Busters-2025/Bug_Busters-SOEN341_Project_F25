-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 02, 2025 at 10:08 PM
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
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(30) NOT NULL,
  `imageUrl` varchar(200) NOT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `ticket_capacity` int(11) DEFAULT 0,
  `remaining_tickets` int(11) NOT NULL,
  `ticket_type` enum('free','paid') DEFAULT 'free',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('DELETED','PUBLISHED','REMOVED') NOT NULL DEFAULT 'PUBLISHED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `category`, `imageUrl`, `event_date`, `location`, `ticket_capacity`, `remaining_tickets`, `ticket_type`, `created_at`, `status`) VALUES
(2, 1, 'Tech Workshop', 'Hands-on session introducing basic AI concepts and coding', '', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop\r\n', '2025-09-12 14:00:00', 'Innovation Hub', 120, 0, 'free', '2025-10-02 03:10:03', 'DELETED'),
(3, 1, 'Spring Music Festival', 'Outdoor music festival with live bands and food trucks', '', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop\n', '2025-04-10 18:00:00', 'Central Park Field', 1000, 0, 'paid', '2025-10-02 03:10:03', 'DELETED'),
(4, 1, 'AI Hackathon 2025', '24-hour hackathon on AI/ML challenges', '', '', '2025-11-15 09:00:00', 'Tech Center', 200, 0, 'free', '2025-10-02 03:10:03', 'DELETED'),
(7, 1, 'Community Volunteering Day', 'Join teams to volunteer across the local community', '', '', '2025-12-01 08:00:00', 'Multiple locations', 300, 0, 'free', '2025-10-02 03:10:03', 'DELETED'),
(8, 2, 'Startup Pitch Demo', 'Showcase startup ideas to investors and mentors', '', '', '2025-12-15 13:00:00', 'Innovation Auditorium', 150, 0, 'paid', '2025-10-02 03:10:03', 'DELETED'),
(9, 1, 't', 't', 'Technology', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-30 22:19:00', 'ttt', 4, 2, 'paid', '2025-10-11 15:39:53', 'DELETED'),
(10, 1, 'title', 'Describe', 'Music', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', '2025-10-01 18:37:00', 'tt', 100, 99, 'free', '2025-10-11 18:42:11', 'DELETED'),
(11, 1, 'Concert', 'Description', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 15:24:00', 'Montreal', 10, 9, 'free', '2025-10-11 19:24:59', 'DELETED'),
(13, 3, 'ti', 't', 'Academic', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-25 03:28:00', 'Montreal', 100, 99, 'free', '2025-10-12 19:28:42', 'PUBLISHED'),
(14, 3, 'hey', 'tt', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-24 17:12:00', 'Montreal', 100, 100, 'free', '2025-10-12 21:12:20', 'PUBLISHED'),
(16, 3, 're', '100', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', '2025-10-31 17:12:00', 'Montreal', 1000, 999, 'free', '2025-10-12 21:12:45', 'PUBLISHED'),
(17, 9, 'e', 'e', 'Technology', 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA', '2025-11-09 16:03:00', 'e', 1, 1, 'free', '2025-11-01 20:03:08', 'DELETED'),
(18, 9, 'test', 'uh', 'Music', 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA', '2025-11-15 16:13:00', 'job', 1, 1, 'free', '2025-11-01 20:13:45', 'DELETED'),
(19, 9, 'test', 'j', 'Technology', 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA', '2025-11-15 16:29:00', 'j', 1, 1, 'free', '2025-11-01 20:29:44', 'DELETED'),
(20, 9, 'test', 'e', 'Technology', 'https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4=', '2025-11-14 11:23:00', 'e', 1, 1, 'free', '2025-11-02 16:23:20', 'DELETED');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `event_id` int(11) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `user_id`, `event_id`, `timestamp`) VALUES
(1, 9, 9, '2025-11-01 19:55:52.569236'),
(2, 9, 10, '2025-11-01 19:57:42.458931'),
(3, 9, 11, '2025-11-01 19:58:31.759700'),
(4, 9, 17, '2025-11-01 20:03:42.779219'),
(5, 9, 18, '2025-11-01 20:13:56.742828'),
(6, 9, 19, '2025-11-01 20:30:22.363501'),
(7, 9, 20, '2025-11-02 16:30:41.939450');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `qr_code` text DEFAULT NULL,
  `qr_payload` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `user_id`, `status`, `checked_in`, `created_at`, `qr_code`, `qr_payload`) VALUES
(5, 13, 5, 'claimed', 0, '2025-10-12 21:06:05', NULL, NULL),
(6, 13, 6, 'claimed', 1, '2025-10-12 21:06:05', NULL, NULL),
(7, 13, 7, 'waitlisted', 0, '2025-10-12 21:06:05', NULL, NULL),
(16, 10, 3, 'claimed', 0, '2025-10-21 21:34:49', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANfSURBVO3BQY7kRhAEQY8E//9l1xwWUJ4KIMhujLRhFn9Q9cdQtQxVy1C1DFXLULUMVctQtQxVy1C1DFXLULUMVctQtQxVy1C1XDyUhG9SeSIJJyp3JGFT2ZLwTSpPDFXLULUMVcvFy1TelIQnkrCp3JGEN6m8KQlvGqqWoWoZqpaLD0vCHSp3JOFEZUvCico3JeEOlU8aqpahahmqlou/jMpJEk5U/s+GqmWoWoaq5eIvk4QTlS0Jf5OhahmqlqFqufgwlW9SOVHZkrAl4SQJJyp3qPwmQ9UyVC1D1XLxsiT8JknYVE5UtiRsKlsS7kjCbzZULUPVMlQt8Qf/YUl4QqX+NVQtQ9UyVC0XDyVhU9mS8CaVTWVLwqZyRxKeUNmS8CaVTxqqlqFqGaqWi4dU7lDZknCisiXhiSScqLxJ5Y4kbCrfNFQtQ9UyVC0XDyVhU9lU7lDZkrCp3JGETeWOJJyobEnYVE6SsKlsSbhD5YmhahmqlqFquXhZEk5U7lA5ScKJypaEE5UTlTuScKJyorIl4ZOGqmWoWoaq5eIhlS0JJ0m4IwknKm9Kwh1JeCIJd6h80lC1DFXLULXEHzyQhDtUTpKwqWxJOFF5Igmbyh1J2FTuSMKJyicNVctQtQxVS/zBA0nYVLYkfJLKSRI+SWVLwh0qJ0m4Q+WJoWoZqpaharn4MpXfROWbVO5QOUnCm4aqZahahqrl4sNUTpKwqWxJ2FS2JGwqm8qWhC0J35SE32yoWoaqZahaLh5SeULlROWJJGwqWxI2lS0Jm8qWhE3ljiRsKidJ2FTeNFQtQ9UyVC0XDyXhm1Q2ld8sCZvKm5KwqTwxVC1D1TJULRcvU3lTEk6SsKm8SeUJlf+SoWoZqpaharn4sCTcofImlROVLQmbypaEkyS8KQmbyicNVctQtQxVy8X/TBI2lS0JdyRhUzlJwptUtiScqDwxVC1D1TJULRd/GZWTJGwqT6jckYRNZVPZkvCmoWoZqpaharn4MJVPUtmScEcSNpWTJJyobEnYVLYk/CZD1TJULUPVcvGyJHxTEk6SsKlsKlsSNpVN5SQJm8odKlsSvmmoWoaqZaha4g+q/hiqlqFqGaqWoWoZqpahahmqlqFqGaqWoWoZqpahahmqlqFqGaqWfwADSHEHcTgb/gAAAABJRU5ErkJggg==', NULL),
(17, 9, 3, 'claimed', 0, '2025-10-21 21:34:54', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANeSURBVO3BMbJbixUDwcEp7n/LYwUO4ORW0eST9G10x1+Y+bdjphwz5Zgpx0w5ZsoxU46ZcsyUY6YcM+WYKcdMOWbKMVOOmfLiQ0n4nVSeJKGptCQ8UXlHEppKS8LvpPKJY6YcM+WYKS++TOWbkvAOlZaEptKS8CQJ36TyTUn4pmOmHDPlmCkvflgS3qHyjiS8Iwl/kyS8Q+UnHTPlmCnHTHkx/yEJT1T+lx0z5Zgpx0x5Mf9BpSXh/8kxU46ZcsyUFz9M5Z8kCU+S8ETlHSp/k2OmHDPlmCkvviwJf5JKS0JTaUloKi0JTaUl4R1J+JsdM+WYKcdMib/wD5aEpjL/vWOmHDPlmCkvPpSEptKS8E0qTaUl4R0qLQmfUGlJ+CaVn3TMlGOmHDMl/sIflISm8iQJT1TekYSm8icloan8TsdMOWbKMVNe/GEqT5LwiSQ0labyJAlPVFoSmkpLwhOVloR3qHzimCnHTDlmyovfLAlN5YlKS0JTaUl4koQnKk9U3pGEJypPVFoSftIxU46ZcsyUFx9KwhOVpvKOJDSVd6i0JDSVloR3JOETSXiHyk86ZsoxU46Z8uIPS0JTaSotCZ9QaUl4ovJEpSWhqbwjCX/SMVOOmXLMlPgLH0hCU/lEEp6o/KQkvEOlJeEdKk+S8A6VTxwz5Zgpx0x58cOS0FRaEp6oPElCU3lHEprKT1J5h8qTJHzTMVOOmXLMlBe/WRKaSktCS0JTeUcSmsqTJPykJPzNjplyzJRjpsRf+AdLwjtU3pGEptKS0FTekYSm8iQJTeWbjplyzJRjprz4UBJ+J5Wm8o4kPFH5piQ0lW9KQlP5xDFTjplyzJQXX6byTUl4koRPqDxR+YTKN6m0JHzTMVOOmXLMlBc/LAnvUPmESkvCkyQ8UWlJeJKEb0pCU2kq33TMlGOmHDPlxf84lSdJeJKEpvIkCd+k0pLwROUTx0w5ZsoxU178n1NpSWgqn1B5RxKaSlNpSfimY6YcM+WYKS9+mMpPUvlEEprKkyQ8UWlJaCotCX+TY6YcM+WYKS++LAm/UxKeqLQkNJWWhKbSVJ4koam8Q6Ul4Xc6ZsoxU46ZEn9h5t+OmXLMlGOmHDPlmCnHTDlmyjFTjplyzJRjphwz5Zgpx0w5Zsq/AEHVZhu0QJ1iAAAAAElFTkSuQmCC', NULL),
(19, 13, 8, 'claimed', 0, '2025-10-29 18:15:22', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN6SURBVO3BQY5jCZYDQeeD7n9ln1z0gqsPCFJEZdXQLP7BzP8cM+WYKcdMOWbKMVOOmXLMlGOmHDPlmCnHTDlmyjFTjplyzJQXH0rCb1J5RxKeqHwiCU2lJeE3qXzimCnHTDlmyosvU/mmJLwjCU3lSRKaSkvCN6l8UxK+6Zgpx0w5ZsqLH5aEd6i8IwlN5R0q/6QkvEPlJx0z5Zgpx0x58R+ThKbSkvAJlf+yY6YcM+WYKS/+Y1RaEppKS0JTaUn4/+SYKcdMOWbKix+m8k9SeaLSkvAkCU3lEyp/k2OmHDPlmCkvviwJf5MkNJWWhKbSktBUWhKaypMk/M2OmXLMlGOmvPiQyr+ZyhOVloSm8kTl3+SYKcdMOWZK/IMPJKGptCR8k8qTJPwklZaEptKS8E0qP+mYKcdMOWZK/IMPJKGpPElCU3lHEprKkyQ0lb9ZEprKbzpmyjFTjpny4ocl4UkSmkpLwjuS8CQJT1RaEp6otCQ0lZaEptJUWhLeofKJY6YcM+WYKS8+pNKS8ETlHSrvUGlJaCotCe9QeUcSmkpLQlNpKi0JP+mYKcdMOWZK/IMPJKGpPEnCE5WWhCcqn0jCO1RaEn6Tyk86ZsoxU46Z8uLLktBUnqi0JDSVloSWhKbSktBUmkpLQlN5otKS0FTekYR/0jFTjplyzJT4Bx9IQlN5koSm8iQJTeUTSfgmlZaEd6g8ScI7VD5xzJRjphwz5cU/LAlPVN6RhHeo/CaVd6g8ScI3HTPlmCnHTHnxy1RaEppKS8I7VJ4koSXhNyXhb3bMlGOmHDMl/sG/WBLeodKS0FRaEppKS0JTeUcSmsqTJDSVbzpmyjFTjpny4kNJ+E0qTaUloak8UflJSWgq35SEpvKJY6YcM+WYKS++TOWbkvAkCU+S8A6VpvIJlX+TY6YcM+WYKS9+WBLeofKTVJ4koam0JDxJwjcloan8pGOmHDPlmCkv/p9JwjuS0FSeJOGbVFoSnqh84pgpx0w5ZsqL/xiVTyShqXxC5R1JaCpNpSXhm46ZcsyUY6a8+GEqP0nlSRKaSktCU3mShCcqLQlNpSXhb3LMlGOmHDPlxZcl4Tcl4RMqLQlNpak8SUJTeYdKS8JvOmbKMVOOmRL/YOZ/jplyzJRjphwz5Zgpx0w5ZsoxU46ZcsyUY6YcM+WYKcdMOWbK/wEkoY3/7xa+DAAAAABJRU5ErkJggg==', 'ticket:19-user:8-event:13'),
(20, 11, 8, 'claimed', 0, '2025-10-29 18:15:25', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN3SURBVO3BQY5jCZYDQeeD7n9ln1r0gqsPCFJEZeXQLP6Dmf85ZsoxU46ZcsyUY6YcM+WYKcdMOWbKMVOOmXLMlGOmHDPlmCkvPpSE36TyJAlNpSWhqXwiCU2lJeE3qXzimCnHTDlmyosvU/mmJHyTyjuS8E0q35SEbzpmyjFTjpny4ocl4R0q70jCO5LwROU3JeEdKj/pmCnHTDlmyou/XBKeqLQkPFH5mx0z5Zgpx0x58ZdR+YRKS8L/J8dMOWbKMVNe/DCV35SEJyotCe9IQlP5hMqf5Jgpx0w5ZsqLL0vCv0mlJeEdKi0JTaUloak8ScKf7Jgpx0w5ZsqLD6n8lyShqTxRaUloKk9U/kuOmXLMlGOmvPhQEppKS8I3qTSVJyotCU+S8ESlJaGptCR8k8pPOmbKMVOOmRL/wRcl4YnKkyQ0lU8k4YnKnyQJTeU3HTPlmCnHTHnxoSQ0lZaEJ0loKi0JT1RaEr4pCU9UWhKayjtUWhLeofKJY6YcM+WYKS8+pPJE5R1JaCrvUHmShE+ovCMJTeUdKi0JP+mYKcdMOWbKiw8l4RMqT5LQVFoSmkpLQlNpSfhEEt6RhE+o/KRjphwz5ZgpL/5lSWgqTaUl4ZtUWhKayhOVloSm8o4k/JuOmXLMlGOmvPgylZaEptKS0JLwk5LwjiQ8UXmShKbSktBUWhJaEp6ofOKYKcdMOWbKix+m0pLQVFoSmsqTJLQkvEPl36TyROVJEr7pmCnHTDlmyotfptKS0FRaEp6otCS8Iwm/KQl/smOmHDPlmCnxH/yHJeEdKi0JTaUloam0JDSVdyShqTxJQlP5pmOmHDPlmCkvPpSE36TSVJ4k4YnKT0pCU/mmJDSVTxwz5Zgpx0x58WUq35SEJ0l4ovIkCU2lqXxC5b/kmCnHTDlmyosfloR3qHxTEppKU2lJaCotCU+S8E1JaCo/6Zgpx0w5ZsqLv5xKS8I7ktBUniThm1RaEp6ofOKYKcdMOWbKi79cEprKkyQ0lU+ovCMJTaWptCR80zFTjplyzJQXP0zlJ6m0JLwjCU3lSRKeqLQkNJWWhD/JMVOOmXLMlBdfloTflISm8g6VloSm0lSeJKGpvEOlJeE3HTPlmCnHTIn/YOZ/jplyzJRjphwz5Zgpx0w5ZsoxU46ZcsyUY6YcM+WYKcdMOWbK/wHI9XkjQRHAygAAAABJRU5ErkJggg==', 'ticket:20-user:8-event:11'),
(23, 16, 8, 'claimed', 1, '2025-10-30 02:53:41', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANrSURBVO3BQY5bCRYDweSD7n/lHC96wdUHBKncbg8j4i/M/OOYKcdMOWbKMVOOmXLMlGOmHDPlmCnHTDlmyjFTjplyzJRjprz4UBJ+J5V3JKGptCQ0lXckoam0JPxOKp84ZsoxU46Z8uLLVL4pCZ9QaUl4RxK+SeWbkvBNx0w5ZsoxU178sCS8Q+UdSWgqLQl/siS8Q+UnHTPlmCnHTHnxl0lCU2lJeJKEJyp/s2OmHDPlmCkv/jIqn1BpSfh/csyUY6YcM+XFD1P5k6m0JDxJQlP5hMqf5Jgpx0w5ZsqLL0vCnyQJTaUloam0JDSVloSm8iQJf7Jjphwz5ZgpLz6k8jdTaUloKk9U/kuOmXLMlGOmxF/4QBKaSkvCN6l8UxLeodKS0FRaEr5J5ScdM+WYKcdMib/wgST8JJWWhKbSktBUWhKayp8kCU3ldzpmyjFTjpny4kMq70jCE5WWhCdJ+ElJeKLSktBUWhKeqLQkvEPlE8dMOWbKMVNefFkSnqi8Q+VJEprKE5VPqLwjCU3lHSotCT/pmCnHTDlmyosPJeGJypMkNJWWhE8k4Scl4R1J+ITKTzpmyjFTjpny4stUWhLekYSm8o4kNJV3JKGpPFFpSWgq70jCv+mYKcdMOWZK/IUPJKGpPElCU3mShCcqT5Lwk1RaEp6otCQ0lZaEd6h84pgpx0w5ZsqLH5aEdyShqbQktCQ8UWlJaCr/JpUnKk+S8E3HTDlmyjFTXvwwlSdJaCotCU3lm5LwOyXhT3bMlGOmHDMl/sJ/WBLeodKS0FRaEppKS0JTeUcSmsqTJDSVbzpmyjFTjpny4kNJ+J1UmsqTJPybktBUvikJTeUTx0w5ZsoxU158mco3JeFJEprKkyQ0lScqn1D5LzlmyjFTjpny4ocl4R0qn0hCU3lHEppKS8KTJHxTEprKTzpmyjFTjpny4v9MEt6RhKbyJAnfpNKS8ETlE8dMOWbKMVNe/GVUWhKaypMkNJVPqLwjCU2lqbQkfNMxU46ZcsyUFz9M5SepPFF5koSm8iQJT1RaEppKS8Kf5Jgpx0w5ZsqLL0vC75SEptKS0FSaSktCU2kqT5LQVN6h0pLwOx0z5Zgpx0yJvzDzj2OmHDPlmCnHTDlmyjFTjplyzJRjphwz5Zgpx0w5ZsoxU46Z8j+1MnIe1soO9QAAAABJRU5ErkJggg==', 'ticket:23-user:8-event:16'),
(26, 9, 9, 'claimed', 0, '2025-11-01 17:53:57', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANfSURBVO3BQW4bQRAEwczG/v/LZR186NMACy4pWa4I84Wqv4aqZahahqplqFqGqmWoWoaqZahahqplqFqGqmWoWoaqZahahqrl4kUqn5SEE5UtCZvKSRLuUNmSsKl8UhJeMVQtQ9UyVC0XD0vCk1SelIRN5UTlSUl4ksqThqplqFqGquXizVTuSMIdKlsSNpWTJHwnlTuS8E5D1TJULUPVcvHLJeFE5Y4k/GZD1TJULUPVcvGfS8KJyv9kqFqGqmWoWi7eLAmfpLIl4UTlDpWTJNyRhJ9kqFqGqmWoWi4epvKdkrCpbEk4ScKmsiVhU7lD5ScbqpahahmqFvOFf5jKk5JworIl4TcZqpahahmqlosXqWxJ2FSelIQtCZvKloRNZUvCpnKShE1lS8Km8qQkvNNQtQxVy1C1mC88SOWOJNyhckcS/iUqWxI+aahahqplqFouXqTyTipbEjaVLQknKidJ2FROkrCpbEk4UdmSsKnckYRXDFXLULUMVcvFhyVhUzlJwitUnpSEO1ROknCShE3lnYaqZahahqrFfOFBKj9JEu5QOUnCpvJJSXinoWoZqpaharl4kcpJEk5UTpJwovIKlZMknCRhU9mScIfKdxqqlqFqGaoW84UXqGxJOFF5UhI2lZMknKjckYRN5SQJm8qWhE3ljiS8YqhahqplqFouvlkSXqHyCpUtCZ+UhJMknKg8aahahqplqFou3kzlDpWTJJwkYVO5Q+WdVH6yoWoZqpahajFf+Iep3JGEO1S2JGwqWxLuUNmScKKyJeFJQ9UyVC1D1XLxIpVPSsKWhE3lROUkCU9S2ZLwJJUtCa8YqpahahmqlouHJeFJKicqWxJOVLYknCThFUl4UhI2lScNVctQtQxVy8WbqdyRhE9SOUnCpnKi8iSVLQlbEp40VC1D1TJULRe/nMqWhE3lRGVLwonKk5KwqZwk4RVD1TJULUPVcvHLqNyRhE1lS8IrknCHypaELQmbypOGqmWoWoaq5eLNkvBOSdhU7lDZknCicpKETWVLwqbykwxVy1C1DFXLxcNUPknlDpUtCZvKloQtCScqWxLuSMKm8klD1TJULUPVYr5Q9ddQtQxVy1C1DFXLULUMVctQtQxVy1C1DFXLULUMVctQtQxVy1C1/AFdd2EjLT4qLgAAAABJRU5ErkJggg==', 'ticket:26-user:9-event:9');

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
(8, 'Liam Handfield', 'billydingdongtv@gmail.com', 'clerk_managed_account', 'student', '2025-10-29 18:12:42', 'user_34kdCbKqdulw2N4WZNKkq8GvZk3'),
(9, 'Jeremy de Passorio', 'depassorio.jeremy@gmail.com', 'clerk_managed_account', 'admin', '2025-11-01 17:51:32', 'user_34M3x04SofltokWrORkMdeQJJce');

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
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qr_payload` (`qr_payload`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `userSavedEvents`
--
ALTER TABLE `userSavedEvents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
