const express = require('express');
const router  = express.Router();
const db      = require('../db');
const auth    = require('../middleware/auth');

// GET /api/playlists  — current user's playlists
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM playlist WHERE user_id = ? ORDER BY created_date DESC',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/playlists/:id  — playlist with songs
router.get('/:id', auth, async (req, res) => {
  try {
    const [[pl]] = await db.execute(
      'SELECT * FROM playlist WHERE playlist_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (!pl) return res.status(404).json({ error: 'Playlist not found' });

    const [songs] = await db.execute(`
      SELECT s.song_id, s.title, s.duration, ar.artist_name, al.title AS album_title,
             g.genre_name, ps.added_at
      FROM playlist_song ps
      JOIN song   s  ON ps.song_id    = s.song_id
      LEFT JOIN album  al ON s.album_id   = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      LEFT JOIN genre  g  ON s.genre_id   = g.genre_id
      WHERE ps.playlist_id = ?
      ORDER BY ps.added_at
    `, [req.params.id]);

    res.json({ ...pl, songs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/playlists  — create
router.post('/', auth, async (req, res) => {
  const { playlist_name } = req.body;
  if (!playlist_name) return res.status(400).json({ error: 'playlist_name required' });
  try {
    const [result] = await db.execute(
      'INSERT INTO playlist (user_id, playlist_name) VALUES (?, ?)',
      [req.user.user_id, playlist_name]
    );
    res.status(201).json({ playlist_id: result.insertId, playlist_name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/playlists/:id/songs  — add song
router.post('/:id/songs', auth, async (req, res) => {
  const { song_id } = req.body;
  if (!song_id) return res.status(400).json({ error: 'song_id required' });
  try {
    await db.execute(
      'INSERT IGNORE INTO playlist_song (playlist_id, song_id) VALUES (?, ?)',
      [req.params.id, song_id]
    );
    res.json({ message: 'Song added to playlist' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/playlists/:id/songs/:songId
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?',
      [req.params.id, req.params.songId]
    );
    res.json({ message: 'Song removed from playlist' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/playlists/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM playlist WHERE playlist_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Playlist deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
