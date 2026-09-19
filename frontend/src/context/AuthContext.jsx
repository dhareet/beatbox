import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('bb_token'));

  const refreshUser = useCallback(async () => {
    const me = await apiFetch('/users/me');
    setUser(me);
    return me;
  }, []);

  // On first load, restore the session if a token exists
  useEffect(() => {
    if (!localStorage.getItem('bb_token')) return;
    refreshUser()
      .catch(() => localStorage.removeItem('bb_token'))
      .finally(() => setLoading(false));
  }, [refreshUser]);

  const authenticate = async (mode, body) => {
    const data = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
    localStorage.setItem('bb_token', data.token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem('bb_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login: (b) => authenticate('login', b), register: (b) => authenticate('register', b), logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
