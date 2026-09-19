import { useMemo, useState } from 'react';
import useFetch from '../components/useFetch.js';
import useLikes from '../components/useLikes.js';
import SongTable from '../components/SongTable.jsx';
import Status from '../components/Status.jsx';

export default function Search() {
  const songs = useFetch('/songs');
  const genres = useFetch('/genres');
  const { likedIds, toggleLike } = useLikes();
  const [text, setText] = useState('');
  const [genre, setGenre] = useState('');

  // Client-side filtering on the already-loaded list; useMemo avoids refiltering on unrelated renders
  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    return (songs.data || []).filter(
      (s) =>
        (!genre || s.genre_name === genre) &&
        (!q || [s.title, s.artist_name, s.album_title].some((f) => f?.toLowerCase().includes(q)))
    );
  }, [songs.data, text, genre]);

  return (
    <>
      <h2>Search</h2>
      <input className="search" placeholder="Search by title, artist or album" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="chips">
        <button className={`chip ${genre === '' ? 'on' : ''}`} onClick={() => setGenre('')}>All</button>
        {(genres.data || []).map((g) => (
          <button key={g.genre_id} className={`chip ${genre === g.name ? 'on' : ''}`} onClick={() => setGenre(g.name)}>
            {g.name}
          </button>
        ))}
      </div>
      <Status loading={songs.loading} error={songs.error} />
      {songs.data && <SongTable songs={filtered} likedIds={likedIds} onLike={toggleLike} />}
    </>
  );
}
