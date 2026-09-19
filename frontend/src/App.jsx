import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Liked from './pages/Liked.jsx';
import Playlists from './pages/Playlists.jsx';
import PlaylistDetail from './pages/PlaylistDetail.jsx';
import Artists from './pages/Artists.jsx';
import ArtistDetail from './pages/ArtistDetail.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="empty">Loading…</p>;
  // Protected app: unauthenticated users only ever see the login/register page
  if (!user) return <AuthPage />;

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PlayerBar />
    </div>
  );
}
