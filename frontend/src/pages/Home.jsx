import useFetch from '../components/useFetch.js';
import useLikes from '../components/useLikes.js';
import SongTable from '../components/SongTable.jsx';
import Status from '../components/Status.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const top = useFetch('/songs/top');
  const all = useFetch('/songs');
  const { likedIds, toggleLike } = useLikes();

  return (
    <>
      <h2>Welcome back, {user.name}</h2>
      <h3>Most played</h3>
      <Status loading={top.loading} error={top.error} />
      {top.data && <SongTable songs={top.data} likedIds={likedIds} onLike={toggleLike} />}
      <h3>All songs</h3>
      <Status loading={all.loading} error={all.error} />
      {all.data && <SongTable songs={all.data} likedIds={likedIds} onLike={toggleLike} />}
    </>
  );
}
