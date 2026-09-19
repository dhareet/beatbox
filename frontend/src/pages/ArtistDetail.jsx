import { Link, useParams } from 'react-router-dom';
import useFetch from '../components/useFetch.js';
import useLikes from '../components/useLikes.js';
import SongTable from '../components/SongTable.jsx';
import Status from '../components/Status.jsx';

export default function ArtistDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/artists/${id}`);
  const { likedIds, toggleLike } = useLikes();

  return (
    <>
      <Link to="/artists" className="link">Back to artists</Link>
      <Status loading={loading} error={error} />
      {data && (
        <>
          <h2>{data.name}</h2>
          <p className="muted">{data.country}{data.debut_year ? `, debuted ${data.debut_year}` : ''}</p>
          {(data.albums || []).map((al) => (
            <section key={al.album_id}>
              <h3>{al.title}</h3>
              <SongTable
                songs={(al.songs || []).map((s) => ({ ...s, artist_name: data.name, album_title: al.title }))}
                likedIds={likedIds}
                onLike={toggleLike}
              />
            </section>
          ))}
        </>
      )}
    </>
  );
}
