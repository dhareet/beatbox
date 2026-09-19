import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import SongTable from '../components/SongTable.jsx';
import Status from '../components/Status.jsx';
import useLikes from '../components/useLikes.js';

export default function Liked() {
  const [songs, setSongs] = useState(null);
  const [error, setError] = useState('');
  const { likedIds, toggleLike } = useLikes();

  useEffect(() => {
    apiFetch('/users/me/liked').then(setSongs).catch((e) => setError(e.message));
  }, []);

  // Unliking here removes the row from the page
  const onLike = async (id) => {
    await toggleLike(id);
    setSongs((prev) => prev.filter((s) => s.song_id !== id));
  };

  return (
    <>
      <h2>Liked songs</h2>
      <Status loading={!songs && !error} error={error} />
      {songs && <SongTable songs={songs} likedIds={likedIds.size ? likedIds : new Set(songs.map((s) => s.song_id))} onLike={onLike} />}
    </>
  );
}
