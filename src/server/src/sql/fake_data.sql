-- This was created by Mattia Vergnat
-- The purpose of this file is to create fake data for the database
-- Import this data after creating the database with the tables in sql/db.sql

START TRANSACTION;

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Tech Society',            'tech-society@events.local',            SHA2('changeme',256), 'organizer'),
  ('Music Club',              'music-club@events.local',              SHA2('changeme',256), 'organizer'),
  ('Math Society',            'math-society@events.local',            SHA2('changeme',256), 'organizer'),
  ('Athletics Department',    'athletics-dept@events.local',          SHA2('changeme',256), 'organizer'),
  ('Fine Arts Club',          'fine-arts-club@events.local',          SHA2('changeme',256), 'organizer'),
  ('Career Services',         'career-services@events.local',         SHA2('changeme',256), 'organizer'),
  ('Green Club',              'green-club@events.local',              SHA2('changeme',256), 'organizer'),
  ('Dance Society',           'dance-society@events.local',           SHA2('changeme',256), 'organizer')
ON DUPLICATE KEY UPDATE
  role = 'organizer',
  password_hash = VALUES(password_hash);


INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Tech Conference 2025',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Technology',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
  '2025-10-15 09:00:00',
  'Convention Center, Montreal',
  500, 234, 'paid'
FROM users u
WHERE u.email = 'tech-society@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Tech Conference 2025' AND e.event_date = '2025-10-15 09:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Music Festival',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Music',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
  '2025-10-20 18:00:00',
  'Parc Jean-Drapeau, Montreal',
  2000, 1500, 'paid'
FROM users u
WHERE u.email = 'music-club@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Music Festival' AND e.event_date = '2025-10-20 18:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Study Group - Calculus',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Academic',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
  '2025-10-12 14:00:00',
  'Library Room 301',
  20, 12, 'free'
FROM users u
WHERE u.email = 'math-society@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Study Group - Calculus' AND e.event_date = '2025-10-12 14:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Basketball Tournament',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Sports',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop',
  '2025-10-18 10:00:00',
  'Gymnasium',
  64, 45, 'paid'
FROM users u
WHERE u.email = 'athletics-dept@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Basketball Tournament' AND e.event_date = '2025-10-18 10:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Art Exhibition Opening',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Arts',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop',
  '2025-10-14 17:00:00',
  'Art Gallery',
  100, 67, 'paid'
FROM users u
WHERE u.email = 'fine-arts-club@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Art Exhibition Opening' AND e.event_date = '2025-10-14 17:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Career Fair',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Career',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop',
  '2025-10-25 10:00:00',
  'Student Center',
  300, 180, 'paid'
FROM users u
WHERE u.email = 'career-services@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Career Fair' AND e.event_date = '2025-10-25 10:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Environmental Workshop',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Environment',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop',
  '2025-10-16 13:00:00',
  'Environmental Science Building',
  50, 23, 'free'
FROM users u
WHERE u.email = 'green-club@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Environmental Workshop' AND e.event_date = '2025-10-16 13:00:00'
  );

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
SELECT u.id,
  'Dance Workshop',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Arts',
  'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=200&fit=crop',
  '2025-10-22 19:00:00',
  'Dance Studio',
  30, 18, 'paid'
FROM users u
WHERE u.email = 'dance-society@events.local'
  AND NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.title = 'Dance Workshop' AND e.event_date = '2025-10-22 19:00:00'
  );

INSERT INTO users (id, name, email, role, clerk_id)
VALUES
  (881, 'Test Student', 'student@example.com', 'student', 'test-user'),
  (882, 'Organizer One', 'org1@example.com', 'organizer', NULL),
  (883, 'Organizer Two', 'org2@example.com', 'organizer', NULL),
  (884, 'Another Student', 'student2@example.com', 'student', NULL);

INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
VALUES
  (882, 'Campus Concert', 'Live music night', 'Music', 'https://example.com/img1.jpg', NOW(), 'Main Hall', 100, 50, 'free'),
  (882, 'Tech Talk', 'JS & Node deep dive', 'Tech', 'https://example.com/img2.jpg', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Auditorium', 80, 80, 'free'),
  (883, 'Art Expo', 'Student art exhibition', 'Art', 'https://example.com/img3.jpg', DATE_ADD(NOW(), INTERVAL 2 DAY), 'Gallery', 120, 120, 'paid');
  
INSERT INTO organizer_subscriptions (user_id, organizer_id)
VALUES
  (881, 882);

COMMIT;