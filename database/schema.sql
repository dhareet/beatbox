-- ============================================================
--  BEATBOX — MySQL Database Schema
--  Music Streaming Platform
-- ============================================================

CREATE DATABASE IF NOT EXISTS beatbox;
USE beatbox;

-- ── GENRE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS genre (
    genre_id    INT AUTO_INCREMENT PRIMARY KEY,
    genre_name  VARCHAR(100) NOT NULL UNIQUE
);

-- ── ARTIST ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist (
    artist_id   INT AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(200) NOT NULL,
    country     VARCHAR(100),
    debut_year  YEAR
);

-- ── ALBUM ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS album (
    album_id     INT AUTO_INCREMENT PRIMARY KEY,
    artist_id    INT NOT NULL,
    title        VARCHAR(300) NOT NULL,
    language     VARCHAR(50),
    release_date DATE,
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE
);

-- ── SONG ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS song (
    song_id      INT AUTO_INCREMENT PRIMARY KEY,
    album_id     INT,
    genre_id     INT,
    title        VARCHAR(300) NOT NULL,
    duration     INT NOT NULL COMMENT 'Duration in seconds',
    release_date DATE,
    FOREIGN KEY (album_id)  REFERENCES album(album_id)  ON DELETE SET NULL,
    FOREIGN KEY (genre_id)  REFERENCES genre(genre_id)  ON DELETE SET NULL
);

-- ── USER ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user (
    user_id           INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(200) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    date_of_birth     DATE,
    join_date         DATE DEFAULT (CURRENT_DATE),
    subscription_type ENUM('free', 'premium') DEFAULT 'free'
);

-- ── PAYMENT ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment (
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    amount       DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT (CURRENT_DATE),
    payment_mode ENUM('credit_card', 'debit_card', 'upi', 'netbanking', 'wallet') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── PLAYLIST ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlist (
    playlist_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    playlist_name VARCHAR(200) NOT NULL,
    created_date  DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── PLAYLIST_SONG  (M:N resolution) ────────────────────────
CREATE TABLE IF NOT EXISTS playlist_song (
    playlist_id INT NOT NULL,
    song_id     INT NOT NULL,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id)     REFERENCES song(song_id)         ON DELETE CASCADE
);

-- ── PLAY_HISTORY ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS play_history (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    song_id          INT NOT NULL,
    listen_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    play_time        INT COMMENT 'Seconds listened',
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE CASCADE
);

-- ── LIKES  (User likes Song — M:N) ─────────────────────────
CREATE TABLE IF NOT EXISTS likes (
    user_id    INT NOT NULL,
    song_id    INT NOT NULL,
    liked_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE CASCADE
);

-- ── PERFORMS  (Artist performs Song — M:N) ─────────────────
CREATE TABLE IF NOT EXISTS performs (
    artist_id INT NOT NULL,
    song_id   INT NOT NULL,
    PRIMARY KEY (artist_id, song_id),
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id)   REFERENCES song(song_id)     ON DELETE CASCADE
);

-- ── TRIGGER: upgrade user to premium on payment ─────────────
DELIMITER $$
CREATE TRIGGER after_payment_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    UPDATE user SET subscription_type = 'premium' WHERE user_id = NEW.user_id;
END$$
DELIMITER ;

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX idx_song_title    ON song(title);
CREATE INDEX idx_album_artist  ON album(artist_id);
CREATE INDEX idx_play_user     ON play_history(user_id);
CREATE INDEX idx_play_song     ON play_history(song_id);
CREATE INDEX idx_playlist_user ON playlist(user_id);
