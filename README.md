# 🎵 BeatBox — Music Streaming App (DBMS Project)

**Stack:** MySQL + Node.js/Express + Vanilla HTML/CSS/JS

---

## Project Structure

```
beatbox/
├── database/
│   ├── schema.sql      ← All CREATE TABLE statements + triggers + indexes
│   ├── seed.sql        ← Sample data (artists, songs, users, playlists)
│   └── queries.sql     ← Notable SQL queries (joins, subqueries, aggregates)
├── backend/
│   ├── server.js       ← Express entry point
│   ├── db.js           ← MySQL connection pool
│   ├── .env.example    ← Environment variables template
│   ├── middleware/
│   │   └── auth.js     ← JWT authentication middleware
│   └── routes/
│       ├── auth.js     ← POST /api/auth/login, /register
│       ├── songs.js    ← GET/POST /api/songs (search, like, play history)
│       ├── artists.js  ← GET /api/artists, /artists/:id
│       ├── playlists.js← Full CRUD playlists + add/remove songs
│       ├── users.js    ← Profile, liked songs, history, payments
│       └── genres.js   ← GET /api/genres
└── frontend/
    └── public/
        └── index.html  ← Single-page app (auth, player, search, playlists)
```

---

## Setup Instructions

### 1. MySQL Database

```bash
# Start MySQL and run:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL password and a JWT secret

npm install
npm run dev        # development (nodemon)
# or
npm start          # production
```

Server runs at: **http://localhost:3001**

### 3. Frontend

The frontend is served automatically by the Express server.
Open **http://localhost:3001** in your browser.

**Demo credentials:**
- Email: `demo@beatbox.com`
- Password: `password123`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login → returns JWT |
| GET | /api/songs | — | All songs (filter: ?genre=&search=) |
| GET | /api/songs/top | — | Top 10 most played |
| GET | /api/songs/:id | — | Single song details |
| POST | /api/songs/:id/play | ✅ | Log play to history |
| POST | /api/songs/:id/like | ✅ | Like a song |
| DELETE | /api/songs/:id/like | ✅ | Unlike a song |
| GET | /api/artists | — | All artists |
| GET | /api/artists/:id | — | Artist with albums & songs |
| GET | /api/genres | — | All genres |
| GET | /api/playlists | ✅ | User's playlists |
| GET | /api/playlists/:id | ✅ | Playlist with songs |
| POST | /api/playlists | ✅ | Create playlist |
| POST | /api/playlists/:id/songs | ✅ | Add song to playlist |
| DELETE | /api/playlists/:id/songs/:sid | ✅ | Remove song from playlist |
| DELETE | /api/playlists/:id | ✅ | Delete playlist |
| GET | /api/users/me | ✅ | User profile |
| GET | /api/users/me/liked | ✅ | Liked songs |
| GET | /api/users/me/history | ✅ | Play history |
| POST | /api/users/me/pay | ✅ | Make payment → upgrades to premium |

---

## Who Built What

| Member | Part | Files to explain |
|--------|------|-----------------|
| Jugraj Bhatia | Project Manager + Frontend | `frontend/public/index.html` |
| Sabhya Kumar | DB Designer + Admin | `database/schema.sql` (DDL, indexes, normalization) |
| Dhareet Shah | Frontend + SQL Dev | `routes/songs.js` + playlist pages in frontend |
| Adit Tambe | Testing + Docs | `database/queries.sql`, this README |
| Ashman Nandan | ER + Schema + SQL | `database/schema.sql` (ER → schema mapping), `queries.sql` |
| Samarth Khurana | Backend + DB | `backend/server.js`, `routes/` |
| Shreyas Prabhu | Backend + DB Admin | `routes/users.js` (transactions), trigger in schema.sql |
