import { Link } from 'react-router-dom';
import useFetch from '../components/useFetch.js';
import Status from '../components/Status.jsx';

export default function Artists() {
  const { data, loading, error } = useFetch('/artists');
  return (
    <>
      <h2>Artists</h2>
      <Status loading={loading} error={error} />
      <div className="grid">
        {(data || []).map((a) => (
          <Link key={a.artist_id} to={`/artists/${a.artist_id}`} className="card">
            <div className="avatar">{a.name[0]}</div>
            <strong>{a.name}</strong>
            <span className="muted">{a.country}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
