const express = require('express');
const router  = express.Router();
const db      = require('../db');
const auth    = require('../middleware/auth');

// GET /api/songs  — all songs with full details, optional ?genre=&search=
router.get('/', async (req, res) => {
  const { genre, search } = req.query;
  let sql = `
    SELECT
      s.song_id, s.title, s.duration, s.release_date,
      ar.artist_id, ar.artist_name,
      al.album_id, al.title AS album_title,
      g.genre_id, g.genre_name
    FROM song s
    LEFT JOIN album  al ON s.album_id  = al.album_id
    LEFT JOIN artist ar ON al.artist_id = ar.artist_id
    LEFT JOIN genre  g  ON s.genre_id   = g.genre_id
    WHERE 1=1
  `;
  const params = [];
  if (genre)  { sql += ' AND g.genre_name = ?';        params.push(genre); }
  if (search) { sql += ' AND s.title LIKE ?';           params.push(`%${search}%`); }
  sql += ' ORDER BY s.title';

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/songs/top  — top 10 most played
router.get('/top', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.song_id, s.title, ar.artist_name, al.title AS album_title,
             g.genre_name, COUNT(ph.id) AS play_count
      FROM play_history ph
      JOIN song   s  ON ph.song_id   = s.song_id
      LEFT JOIN album  al ON s.album_id  = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      LEFT JOIN genre  g  ON s.genre_id   = g.genre_id
      GROUP BY ph.song_id
      ORDER BY play_count DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, ar.artist_name, al.title AS album_title, g.genre_name
      FROM song s
      LEFT JOIN album  al ON s.album_id  = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      LEFT JOIN genre  g  ON s.genre_id   = g.genre_id
      WHERE s.song_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Song not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/songs/:id/play  — log play history
router.post('/:id/play', auth, async (req, res) => {
  const { play_time } = req.body;
  try {
    await db.execute(
      'INSERT INTO play_history (user_id, song_id, play_time) VALUES (?, ?, ?)',
      [req.user.user_id, req.params.id, play_time || null]
    );
    res.json({ message: 'Play logged' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/songs/:id/like  — like a song
router.post('/:id/like', auth, async (req, res) => {
  try {
    await db.execute(
      'INSERT IGNORE INTO likes (user_id, song_id) VALUES (?, ?)',
      [req.user.user_id, req.params.id]
    );
    res.json({ message: 'Song liked' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/songs/:id/like  — unlike
router.delete('/:id/like', auth, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM likes WHERE user_id = ? AND song_id = ?',
      [req.user.user_id, req.params.id]
    );
    res.json({ message: 'Song unliked' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
