-- ============================================================
--  BEATBOX — Seed Data
-- ============================================================
USE beatbox;

-- GENRES
INSERT INTO genre (genre_name) VALUES
('Pop'), ('Rock'), ('Hip-Hop'), ('Jazz'), ('Classical'),
('Electronic'), ('R&B'), ('Country'), ('Bollywood'), ('Indie');

-- ARTISTS
INSERT INTO artist (artist_name, country, debut_year) VALUES
('The Weeknd',     'Canada', 2010),
('Arijit Singh',   'India',  2005),
('Daft Punk',      'France', 1993),
('Taylor Swift',   'USA',    2006),
('Kendrick Lamar', 'USA',    2003),
('A.R. Rahman',    'India',  1992),
('Ed Sheeran',     'UK',     2004),
('Billie Eilish',  'USA',    2015);

-- ALBUMS
INSERT INTO album (artist_id, title, language, release_date) VALUES
(1, 'After Hours',        'English', '2020-03-20'),
(1, 'Starboy',            'English', '2016-11-25'),
(2, 'Aashiqui 2 OST',     'Hindi',   '2013-04-08'),
(3, 'Random Access Memories','English','2013-05-17'),
(4, 'Midnights',          'English', '2022-10-21'),
(5, 'DAMN.',              'English', '2017-04-14'),
(6, 'Slumdog Millionaire','Hindi',   '2008-01-01'),
(7, '÷ (Divide)',         'English', '2017-03-03'),
(8, 'When We All Fall Asleep','English','2019-03-29');

-- SONGS
INSERT INTO song (album_id, genre_id, title, duration, release_date) VALUES
(1,  1,  'Blinding Lights',     200, '2019-11-29'),
(1,  1,  'Save Your Tears',     215, '2020-08-24'),
(2,  1,  'Starboy',             230, '2016-09-22'),
(3,  9,  'Tum Hi Ho',           262, '2013-04-08'),
(3,  9,  'Sun Hain',            198, '2013-04-08'),
(4,  6,  'Get Lucky',           248, '2013-04-19'),
(4,  6,  'Instant Crush',       337, '2013-05-17'),
(5,  1,  'Anti-Hero',           200, '2022-10-21'),
(5,  1,  'Lavender Haze',       202, '2022-10-21'),
(6,  3,  'HUMBLE.',             177, '2017-04-07'),
(6,  3,  'DNA.',                185, '2017-04-14'),
(7,  9,  'Jai Ho',              292, '2008-01-01'),
(8,  1,  'Shape of You',        234, '2017-01-06'),
(8,  1,  'Perfect',             263, '2017-03-03'),
(9,  1,  'Bad Guy',             194, '2019-03-29'),
(9,  1,  'Lovely',              200, '2019-03-29');

-- PERFORMS (artist → song)
INSERT INTO performs (artist_id, song_id) VALUES
(1,1),(1,2),(1,3),(2,4),(2,5),(3,6),(3,7),(4,8),(4,9),(5,10),(5,11),(6,12),(7,13),(7,14),(8,15),(8,16);

-- USERS (passwords are bcrypt of 'password123')
INSERT INTO user (name, email, password_hash, date_of_birth, join_date, subscription_type) VALUES
('Jugraj Bhatia',  'jugraj@beatbox.com',  '$2b$10$abcdefghijklmnopqrstuuVGZzCwFI/cJOepLlRKtxwFMX3NQOP.i', '2004-05-12', '2024-01-10', 'premium'),
('Ashman Nandan',  'ashman@beatbox.com',  '$2b$10$abcdefghijklmnopqrstuuVGZzCwFI/cJOepLlRKtxwFMX3NQOP.i', '2004-08-20', '2024-01-15', 'free'),
('Sabhya Kumar',   'sabhya@beatbox.com',  '$2b$10$abcdefghijklmnopqrstuuVGZzCwFI/cJOepLlRKtxwFMX3NQOP.i', '2004-03-05', '2024-01-18', 'premium'),
('Dhareet Shah',   'dhareet@beatbox.com', '$2b$10$abcdefghijklmnopqrstuuVGZzCwFI/cJOepLlRKtxwFMX3NQOP.i', '2004-07-22', '2024-02-01', 'free'),
('Demo User',      'demo@beatbox.com',    '$2b$10$abcdefghijklmnopqrstuuVGZzCwFI/cJOepLlRKtxwFMX3NQOP.i', '2000-01-01', '2024-03-01', 'free');

-- PLAYLISTS
INSERT INTO playlist (user_id, playlist_name, created_date) VALUES
(1, 'Late Night Vibes',  '2024-02-01'),
(1, 'Workout Hits',      '2024-02-15'),
(2, 'Bollywood Feels',   '2024-02-10'),
(3, 'Electronic Dreams', '2024-03-01'),
(5, 'My Favourites',     '2024-03-10');

-- PLAYLIST_SONGS
INSERT INTO playlist_song (playlist_id, song_id) VALUES
(1,1),(1,2),(1,15),(1,16),
(2,3),(2,8),(2,10),(2,13),
(3,4),(3,5),(3,12),
(4,6),(4,7),
(5,1),(5,8),(5,13),(5,15);

-- LIKES
INSERT INTO likes (user_id, song_id) VALUES
(1,1),(1,2),(1,6),(1,15),
(2,4),(2,5),(2,12),
(3,6),(3,7),(3,1),
(4,8),(4,9),(4,15),
(5,1),(5,13),(5,14);

-- PLAY HISTORY
INSERT INTO play_history (user_id, song_id, listen_timestamp, play_time) VALUES
(1,1,'2024-03-01 10:00:00',200),(1,2,'2024-03-01 10:04:00',215),
(1,6,'2024-03-02 18:00:00',248),(2,4,'2024-03-01 09:00:00',262),
(3,6,'2024-03-03 20:00:00',248),(4,8,'2024-03-04 15:00:00',200),
(5,1,'2024-03-05 11:00:00',200),(5,13,'2024-03-05 11:04:00',234);

-- PAYMENTS
INSERT INTO payment (user_id, amount, payment_date, payment_mode) VALUES
(1, 199.00, '2024-01-10', 'upi'),
(3, 199.00, '2024-01-18', 'credit_card');
