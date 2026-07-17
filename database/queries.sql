-- ============================================================
--  BEATBOX — Notable SQL Queries
-- ============================================================
USE beatbox;

-- 1. All songs with artist name, album, genre
SELECT
    s.song_id, s.title AS song_title,
    ar.artist_name,
    al.title  AS album_title,
    g.genre_name,
    SEC_TO_TIME(s.duration) AS duration
FROM song s
JOIN album   al ON s.album_id  = al.album_id
JOIN artist  ar ON al.artist_id = ar.artist_id
JOIN genre   g  ON s.genre_id   = g.genre_id;

-- 2. Top 5 most played songs
SELECT
    s.title, ar.artist_name,
    COUNT(ph.id) AS play_count
FROM play_history ph
JOIN song   s  ON ph.song_id   = s.song_id
JOIN album  al ON s.album_id   = al.album_id
JOIN artist ar ON al.artist_id = ar.artist_id
GROUP BY ph.song_id
ORDER BY play_count DESC
LIMIT 5;

-- 3. All songs liked by a user (user_id = 1)
SELECT s.title, ar.artist_name, g.genre_name
FROM likes l
JOIN song   s  ON l.song_id    = s.song_id
JOIN album  al ON s.album_id   = al.album_id
JOIN artist ar ON al.artist_id = ar.artist_id
JOIN genre  g  ON s.genre_id   = g.genre_id
WHERE l.user_id = 1;

-- 4. Playlist contents for a user
SELECT
    p.playlist_name,
    s.title AS song_title,
    ar.artist_name,
    ps.added_at
FROM playlist_song ps
JOIN playlist p  ON ps.playlist_id = p.playlist_id
JOIN song     s  ON ps.song_id     = s.song_id
JOIN album    al ON s.album_id     = al.album_id
JOIN artist   ar ON al.artist_id   = ar.artist_id
WHERE p.user_id = 1
ORDER BY p.playlist_name, ps.added_at;

-- 5. Revenue report by payment mode
SELECT
    payment_mode,
    COUNT(*)       AS transactions,
    SUM(amount)    AS total_revenue
FROM payment
GROUP BY payment_mode;

-- 6. Users who never paid (free users)
SELECT u.user_id, u.name, u.email, u.subscription_type
FROM user u
LEFT JOIN payment p ON u.user_id = p.user_id
WHERE p.payment_id IS NULL;

-- 7. Most liked song per genre
SELECT g.genre_name, s.title, COUNT(l.song_id) AS likes
FROM likes l
JOIN song  s ON l.song_id  = s.song_id
JOIN genre g ON s.genre_id = g.genre_id
GROUP BY s.song_id
HAVING likes = (
    SELECT MAX(likes_count) FROM (
        SELECT COUNT(*) AS likes_count
        FROM likes l2
        JOIN song s2 ON l2.song_id = s2.song_id
        WHERE s2.genre_id = g.genre_id
    ) sub
);

-- 8. Recent listening history of a user
SELECT
    s.title, ar.artist_name,
    ph.listen_timestamp,
    SEC_TO_TIME(ph.play_time) AS time_listened
FROM play_history ph
JOIN song   s  ON ph.song_id   = s.song_id
JOIN album  al ON s.album_id   = al.album_id
JOIN artist ar ON al.artist_id = ar.artist_id
WHERE ph.user_id = 1
ORDER BY ph.listen_timestamp DESC;
