import { fmtDuration } from '../api.js';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function PlayerBar() {
  const { current, playing, elapsed, toggle, next, prev, seek } = usePlayer();
  const total = Number(current?.duration) || 0;

  return (
    <footer className="player">
      <div className="now">
        {current ? (
          <>
            <div className="now-title">{current.title}</div>
            <div className="now-artist">{current.artist_name}</div>
          </>
        ) : (
          <div className="now-artist">Pick a song to start listening</div>
        )}
      </div>
      <div className="controls">
        <button className="btn ghost small" onClick={prev} disabled={!current}>Prev</button>
        <button className="btn small" onClick={toggle} disabled={!current}>{playing ? 'Pause' : 'Play'}</button>
        <button className="btn ghost small" onClick={next} disabled={!current}>Next</button>
      </div>
      <div className="progress">
        <span className="mono">{fmtDuration(elapsed)}</span>
        <input type="range" min="0" max={total || 1} value={Math.min(elapsed, total)} onChange={(e) => seek(Number(e.target.value))} disabled={!current} aria-label="Seek" />
        <span className="mono">{fmtDuration(total)}</span>
      </div>
    </footer>
  );
}
