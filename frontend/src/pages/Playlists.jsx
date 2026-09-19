import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api.js';
import useFetch from '../components/useFetch.js';
import Status from '../components/Status.jsx';
import Modal from '../components/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Playlists() {
  const { data, loading, error, reload } = useFetch('/playlists');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const toast = useToast();

  const create = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/playlists', { method: 'POST', body: JSON.stringify({ name }) });
      setName('');
      setCreating(false);
      toast('Playlist created');
      reload();
    } catch (err) {
      toast(err.message);
    }
  };

  return (
    <>
      <div className="row">
        <h2>Playlists</h2>
        <button className="btn small" onClick={() => setCreating(true)}>New playlist</button>
      </div>
      <Status loading={loading} error={error} />
      {data && !data.length && <p className="empty">You have no playlists yet. Create one to start collecting songs.</p>}
      <div className="list">
        {(data || []).map((p) => (
          <Link key={p.playlist_id} to={`/playlists/${p.playlist_id}`} className="list-item">
            <strong>{p.name}</strong>
          </Link>
        ))}
      </div>
      {creating && (
        <Modal title="New playlist" onClose={() => setCreating(false)}>
          <form onSubmit={create}>
            <label>Name<input autoFocus value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <div className="row end">
              <button type="button" className="btn ghost small" onClick={() => setCreating(false)}>Cancel</button>
              <button className="btn small">Create playlist</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
