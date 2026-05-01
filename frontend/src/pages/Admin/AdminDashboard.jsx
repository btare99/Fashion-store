import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { ordersAPI, productsAPI } from '../../services/api';
import './Admin.css';

const STATUS_MAP = {
  'Në pritje': 'pending', 'Konfirmuar': 'confirmed',
  'Dërguar': 'shipped', 'Dorëzuar': 'delivered', 'Anuluar': 'cancelled',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          ordersAPI.getStats(),
          ordersAPI.getAll(),
          productsAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 8));
        setProductCount(productsRes.data.length);
      } catch { }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Të Ardhura', value: stats ? `${stats.revenue.toFixed(0)} €` : '—', icon: <FiDollarSign size={20}/>, bg: 'rgba(201,169,110,0.1)', color: 'var(--gold)' },
    { label: 'Total Porosi', value: stats?.total ?? '—', icon: <FiShoppingBag size={20}/>, bg: 'rgba(139,92,246,0.1)', color: '#a78bfa' },
    { label: 'Në Pritje', value: stats?.pending ?? '—', icon: <FiClock size={20}/>, bg: 'rgba(251,191,36,0.1)', color: 'var(--warning)' },
    { label: 'Produkte', value: productCount, icon: <FiPackage size={20}/>, bg: 'rgba(74,222,128,0.1)', color: 'var(--success)' },
  ];

  return (
    <div className="admin-dashboard page-enter">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__subtitle">Mirë se vini në panelin e LUXE Store</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Produkt i Ri
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats">
        {statCards.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div>
              <div className="admin-stat-card__label">{c.label}</div>
              <div className="admin-stat-card__value" style={{color: c.color}}>{loading ? '...' : c.value}</div>
            </div>
            <div className="admin-stat-card__icon" style={{background: c.bg, color: c.color}}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <h2 style={{fontSize:'1rem',fontWeight:700,color:'var(--text-primary)',display:'flex',alignItems:'center',gap:8}}>
            <FiTrendingUp size={18} color="var(--gold)"/> Porositë e Fundit
          </h2>
          <Link to="/admin/orders" className="btn btn-ghost" style={{fontSize:'0.82rem',padding:'6px 12px'}}>
            Shiko të gjitha <FiArrowRight size={13}/>
          </Link>
        </div>
        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:48,borderRadius:8}}/>)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="empty-state" style={{padding:'40px 0'}}>
            <div className="empty-state-icon"><FiPackage size={48} color="var(--border)" /></div>
            <h3>Nuk ka porosi ende</h3>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nr. Porosisë</th>
                  <th>Klienti</th>
                  <th>Artikuj</th>
                  <th>Total</th>
                  <th>Statusi</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><strong style={{color:'var(--gold)'}}>{order.orderNumber}</strong></td>
                    <td style={{color:'var(--text-primary)'}}>{order.customer.firstName} {order.customer.lastName}</td>
                    <td>{order.items.length} artikuj</td>
                    <td style={{color:'var(--text-primary)',fontWeight:600}}>{order.total.toFixed(2)} €</td>
                    <td>
                      <span className={`status-badge status-badge--${STATUS_MAP[order.status] || 'pending'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('sq-AL')}</td>
                    <td>
                      <Link to="/admin/orders" className="btn btn-ghost" style={{padding:'4px 10px',fontSize:'0.78rem'}}>
                        Shiko
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
