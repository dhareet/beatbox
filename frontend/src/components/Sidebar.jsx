import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/', 'Home'],
  ['/search', 'Search'],
  ['/liked', 'Liked songs'],
  ['/playlists', 'Playlists'],
  ['/artists', 'Artists'],
  ['/profile', 'Profile'],
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="logo">BeatBox</div>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="who">{user?.name}</div>
        <button className="btn ghost small" onClick={logout}>Log out</button>
      </div>
    </aside>
  );
}
