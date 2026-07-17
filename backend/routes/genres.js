const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/genres
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM genre ORDER BY genre_name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/genres/:id/songs
router.get('/:id/songs', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.song_id, s.title, s.duration, ar.artist_name, al.title AS album_title
      FROM song s
      LEFT JOIN album  al ON s.album_id  = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      WHERE s.genre_id = ?
      ORDER BY s.title
    `, [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
