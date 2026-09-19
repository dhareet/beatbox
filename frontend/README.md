# BeatBox frontend (React + Vite)

Replaces `frontend/public/index.html`. Talks to the existing Express API unchanged.

## Run
1. Start the backend: `cd backend && npm start` (port 3001)
2. In this folder: `npm install && npm run dev` -> http://localhost:5173
   (Vite proxies `/api` to `localhost:3001`, so no CORS setup is needed.)

## Put it in your repo
Copy this folder to `beatbox/frontend/` (replace the old `public/` contents).
For production: `npm run build`, then point `express.static` in `server.js`
at `frontend/dist` and make the SPA fallback return `dist/index.html`.

## Structure
- `context/`  Auth (user + JWT), Player (queue, timer playback), Toast
- `components/`  Sidebar, SongTable (reused everywhere), PlayerBar, Modal, useFetch, useLikes
- `pages/`  AuthPage, Home, Search, Liked, Playlists, PlaylistDetail, Artists, ArtistDetail, Profile

## Field names to verify against your API
I wrote this from your code explanation, not the actual route files, so check these
against your real JSON responses and adjust if needed:
- Songs: `song_id, title, artist_name, album_title, genre_name, duration` (seconds)
- Genres: `genre_id, name`; Artists: `artist_id, name, country, debut_year`, plus `albums[].songs[]` on detail
- Playlists: `playlist_id, name`; detail returns `{ name, songs: [...] }`
- Add to playlist body: `{ song_id }`; create playlist body: `{ name }`
- Pay body: `{ amount, payment_mode }`; history rows: `song_id, title, artist_name, played_at`
- Register body: `{ name, email, password }`; auth response includes `token`
