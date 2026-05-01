import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FiGrid, FiPackage, FiShoppingBag, FiLogOut, FiExternalLink } from 'react-icons/fi';
import './Admin.css';

export default function AdminLayout() {
  const { isAuthenticated, adminUser, logout } = useAdmin();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  const location = useLocation();
  const navItems = [
    { to: '/admin', icon: <FiGrid size={18}/>, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: <FiPackage size={18}/>, label: 'Produktet' },
    { to: '/admin/orders', icon: <FiShoppingBag size={18}/>, label: 'Porositë' },
  ];
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-text">LUXE</span>
          <span className="admin-sidebar__logo-badge">Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`admin-nav-item ${active ? 'active' : ''}`}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank" className="admin-sidebar__store-link">
            <FiExternalLink size={14}/> Shiko Dyqanin
          </Link>
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{adminUser?.[0]?.toUpperCase()}</div>
            <span>{adminUser}</span>
          </div>
          <button className="admin-sidebar__logout" onClick={logout}>
            <FiLogOut size={16}/> Dil
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
