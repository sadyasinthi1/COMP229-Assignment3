import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Education', path: '/education' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

export default function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  async function logout() { await signOut(); navigate('/'); }
  return <header className="site-header">
    <nav className="nav-shell" aria-label="Primary navigation">
      <NavLink to="/" className="brand" aria-label="Sadya portfolio home">
        <span className="brand-mark" aria-hidden="true">SS</span>
        <span className="brand-name">Sadya Sinthi</span>
      </NavLink>
      <div className="nav-links">
        {navigationItems.map(item => <NavLink
          key={item.path} to={item.path} end={item.path === '/'}
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >{item.label}</NavLink>)}
        {user?.role === 'admin' && <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>}
        {!user ? <>
          <NavLink className="nav-link" to="/signin">Sign In</NavLink>
          <NavLink className="nav-link" to="/signup">Sign Up</NavLink>
        </> : <>
          <span className="login-role" title={user.email}>{user.role === 'admin' ? 'Admin' : 'User'}</span>
          <button className="nav-link nav-button" type="button" onClick={logout}>Sign Out</button>
        </>}
      </div>
    </nav>
  </header>;
}
