import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/dashboard">
          ClearJunk Admin Portal
        </Link>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/route-optimisation">Route Optimisation</NavLink>
        </nav>
        <div className="header-right">
          <span>{user?.email}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
