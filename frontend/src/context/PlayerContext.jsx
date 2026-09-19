import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api.js';

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null); // ref: changing it should not cause re-renders

  const current = index >= 0 ? queue[index] : null;

  const play = useCallback((songs, startIndex = 0) => {
    setQueue(songs);
    setIndex(startIndex);
    setElapsed(0);
    setPlaying(true);
    const song = songs[startIndex];
    if (song && localStorage.getItem('bb_token')) {
      apiFetch(`/songs/${song.song_id}/play`, { method: 'POST' }).catch(() => {});
    }
  }, []);

  const next = useCallback(() => {
    if (!queue.length) return;
    play(queue, (index + 1) % queue.length);
  }, [queue, index, play]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    play(queue, (index - 1 + queue.length) % queue.length);
  }, [queue, index, play]);

  const toggle = () => current && setPlaying((p) => !p);
  const seek = (sec) => setElapsed(sec);

  // Simulated playback: tick once a second while playing.
  // The cleanup function prevents duplicate intervals when deps change.
  useEffect(() => {
    if (!playing || !current) return;
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [playing, current]);

  // Auto-advance when the song finishes
  useEffect(() => {
    if (current && elapsed >= Number(current.duration)) next();
  }, [elapsed, current, next]);

  return (
    <PlayerContext.Provider value={{ current, playing, elapsed, play, next, prev, toggle, seek }}>
      {children}
    </PlayerContext.Provider>
  );
}
