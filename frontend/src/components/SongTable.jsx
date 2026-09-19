import { fmtDuration } from '../api.js';
import { usePlayer } from '../context/PlayerContext.jsx';

// Reusable: receives songs as a prop so every page can share it.
// `onLike` and `renderAction` are optional so each page decides what extra actions to show.
export default function SongTable({ songs, likedIds, onLike, renderAction }) {
  const { play, current } = usePlayer();

  if (!songs.length) return <p className="empty">No songs here yet.</p>;

  return (
    <div className="table-wrap">
      <table className="songs">
        <thead>
          <tr>
            <th>#</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Time</th><th></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((s, i) => {
            const liked = likedIds?.has(s.song_id);
            return (
              <tr key={s.song_id} className={current?.song_id === s.song_id ? 'playing' : ''}>
                <td>
                  <button className="link" onClick={() => play(songs, i)} aria-label={`Play ${s.title}`}>▶</button>
                </td>
                <td className="title">{s.title}</td>
                <td>{s.artist_name}</td>
                <td>{s.album_title}</td>
                <td>{s.genre_name}</td>
                <td className="mono">{fmtDuration(s.duration)}</td>
                <td className="actions">
                  {onLike && (
                    <button className={`heart ${liked ? 'on' : ''}`} onClick={() => onLike(s.song_id)} aria-label={liked ? 'Unlike' : 'Like'} aria-pressed={!!liked}>
                      ♥
                    </button>
                  )}
                  {renderAction?.(s)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
