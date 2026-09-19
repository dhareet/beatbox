import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api.js';
import useFetch from '../components/useFetch.js';
import useLikes from '../components/useLikes.js';
import SongTable from '../components/SongTable.jsx';
import Status from '../components/Status.jsx';
import Modal from '../components/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const playlist = useFetch(`/playlists/${id}`);
  const allSongs = useFetch('/songs');
  const { likedIds, toggleLike } = useLikes();
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const songs = playlist.data?.songs || [];

  const addSong = async (songId) => {
    try {
      await apiFetch(`/playlists/${id}/songs`, { method: 'POST', body: JSON.stringify({ song_id: songId }) });
      toast('Song added');
      playlist.reload();
    } catch (e) { toast(e.message); }
  };

  const removeSong = async (songId) => {
    try {
      await apiFetch(`/playlists/${id}/songs/${songId}`, { method: 'DELETE' });
      toast('Song removed');
      playlist.reload();
    } catch (e) { toast(e.message); }
  };

  const deletePlaylist = async () => {
    try {
      await apiFetch(`/playlists/${id}`, { method: 'DELETE' });
      toast('Playlist deleted');
      navigate('/playlists');
    } catch (e) { toast(e.message); }
  };

  const inPlaylist = new Set(songs.map((s) => s.song_id));

  return (
    <>
      <Status loading={playlist.loading} error={playlist.error} />
      {playlist.data && (
        <>
          <div className="row">
            <h2>{playlist.data.name}</h2>
            <div className="row">
              <button className="btn small" onClick={() => setAdding(true)}>Add songs</button>
              <button className="btn ghost small danger" onClick={() => setConfirmDelete(true)}>Delete playlist</button>
            </div>
          </div>
          <SongTable
            songs={songs}
            likedIds={likedIds}
            onLike={toggleLike}
            renderAction={(s) => <button className="link" onClick={() => removeSong(s.song_id)}>Remove</button>}
          />
        </>
      )}

      {adding && (
        <Modal title="Add songs" onClose={() => setAdding(false)}>
          <div className="pick-list">
            {(allSongs.data || []).map((s) => (
              <div key={s.song_id} className="pick">
                <span>{s.title} <em>{s.artist_name}</em></span>
                <button className="btn ghost small" disabled={inPlaylist.has(s.song_id)} onClick={() => addSong(s.song_id)}>
                  {inPlaylist.has(s.song_id) ? 'Added' : 'Add'}
                </button>
              </div>
            ))}
          </div>
          <div className="row end"><button className="btn small" onClick={() => setAdding(false)}>Done</button></div>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete this playlist?" onClose={() => setConfirmDelete(false)}>
          <p>This removes the playlist and its song list. The songs themselves stay in BeatBox.</p>
          <div className="row end">
            <button className="btn ghost small" onClick={() => setConfirmDelete(false)}>Keep playlist</button>
            <button className="btn small danger" onClick={deletePlaylist}>Delete playlist</button>
          </div>
        </Modal>
      )}
    </>
  );
}
