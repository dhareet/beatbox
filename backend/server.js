require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ─────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/songs',     require('./routes/songs'));
app.use('/api/artists',   require('./routes/artists'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/genres',    require('./routes/genres'));

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'BeatBox' }));

// ── SPA fallback (serve index.html for all non-API routes) ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🎵  BeatBox server running at http://localhost:${PORT}`);
  console.log(`📡  API available at http://localhost:${PORT}/api\n`);
});
