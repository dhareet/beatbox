// ── artists.js ────────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const db       = require('../db');

// GET /api/artists
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM artist ORDER BY artist_name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/artists/:id  — with their albums & songs
router.get('/:id', async (req, res) => {
  try {
    const [[artist]] = await db.execute('SELECT * FROM artist WHERE artist_id = ?', [req.params.id]);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });

    const [albums] = await db.execute(
      'SELECT * FROM album WHERE artist_id = ? ORDER BY release_date DESC', [req.params.id]);

    for (const album of albums) {
      const [songs] = await db.execute(
        'SELECT s.*, g.genre_name FROM song s LEFT JOIN genre g ON s.genre_id = g.genre_id WHERE s.album_id = ?',
        [album.album_id]);
      album.songs = songs;
    }
    res.json({ ...artist, albums });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
