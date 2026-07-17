const express = require('express');
const router  = express.Router();
const db      = require('../db');
const auth    = require('../middleware/auth');

// GET /api/users/me  — current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const [[user]] = await db.execute(
      'SELECT user_id, name, email, date_of_birth, join_date, subscription_type FROM user WHERE user_id = ?',
      [req.user.user_id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users/me/liked  — liked songs
router.get('/me/liked', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.song_id, s.title, s.duration, ar.artist_name,
             al.title AS album_title, g.genre_name, l.liked_at
      FROM likes l
      JOIN song   s  ON l.song_id    = s.song_id
      LEFT JOIN album  al ON s.album_id   = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      LEFT JOIN genre  g  ON s.genre_id   = g.genre_id
      WHERE l.user_id = ?
      ORDER BY l.liked_at DESC
    `, [req.user.user_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users/me/history  — play history
router.get('/me/history', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.song_id, s.title, ar.artist_name,
             ph.listen_timestamp, ph.play_time
      FROM play_history ph
      JOIN song   s  ON ph.song_id   = s.song_id
      LEFT JOIN album  al ON s.album_id   = al.album_id
      LEFT JOIN artist ar ON al.artist_id = ar.artist_id
      WHERE ph.user_id = ?
      ORDER BY ph.listen_timestamp DESC
      LIMIT 50
    `, [req.user.user_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/users/me/pay  — make a payment & upgrade to premium
router.post('/me/pay', auth, async (req, res) => {
  const { amount, payment_mode } = req.body;
  if (!amount || !payment_mode)
    return res.status(400).json({ error: 'amount and payment_mode required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      'INSERT INTO payment (user_id, amount, payment_mode) VALUES (?, ?, ?)',
      [req.user.user_id, amount, payment_mode]
    );
    // Trigger in DB handles the subscription upgrade, but also do it here for safety
    await conn.execute(
      "UPDATE user SET subscription_type = 'premium' WHERE user_id = ?",
      [req.user.user_id]
    );

    await conn.commit();
    res.json({ message: 'Payment successful. Account upgraded to Premium!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/users/me/payments  — payment history
router.get('/me/payments', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM payment WHERE user_id = ? ORDER BY payment_date DESC',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
