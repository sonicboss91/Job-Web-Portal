import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'clearjunk-auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: '', user: null };
  });

  const login = ({ token, user }) => {
    const next = { token, user };
    setAuth(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const logout = () => {
    const next = { token: '', user: null };
    setAuth(next);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ ...auth, login, logout, isAuthenticated: Boolean(auth.token) }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
